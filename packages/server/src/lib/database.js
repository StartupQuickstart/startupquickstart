import path from 'path';
import glob from 'glob';
import { Sequelize } from 'sequelize';
import passwordGenerator from 'generate-password';
import AwsSecretManager from './aws/secret-manager';

export class Database {
  static connected = false;
  static connection = null;
  static models = {};

  /**
   * Creates a database on the app environments database
   *
   * @param {String} dbName Name of the database to create
   */
  static async createDatabase(dbName) {
    const results = await this.connection.query(`
      SELECT FROM pg_catalog.pg_database
      WHERE lower(datname) = lower('${dbName}')
    `);

    if (!results[0].length) {
      await this.connection.query(`CREATE DATABASE ${dbName};`);
    }
  }

  /**
   * Connects to the database
   *
   * @param {Object} options Options for connectdion
   */
  static connect(options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.connected) {
          return resolve(this.connection);
        }

        console.log('Connecting to database...');

        const creds = await this.getCredentials('svc_app');

        if (options.lambda) {
          console.log('Lambda config not found.');
        }

        this.connection = new Sequelize(
          creds.dbname,
          creds.username,
          creds.password,
          {
            host: creds.host,
            port: creds.port || 5432,
            dialect: creds.engine,
            directory: false,
            ssl: true,
            logging: false,
            dialectOptions: { ssl: { rejectUnauthorized: false } }
          }
        );

        if (options.setRole) {
          this.connection.afterConnect(async (conn) => {
            await conn.query(`SET ROLE ${creds.dbname}`);
          });
        }

        this.connected = true;
        resolve(this.connection);
      } catch (err) {
        return reject(err);
      }
    });
  }

  /**
   * Gets the credentials for a database user
   *
   * @param {String} user User to get creds for
   * @param {String} env Environment to get creds for
   */
  static async getCredentials(user, env = process.env.ENV) {
    const credentials = await AwsSecretManager.get('db/creds', user, env);

    if (!credentials) {
      throw new Error(`Could not find creds for user ${user}`);
    }

    return credentials;
  }

  /**
   * Generates a 32 bit password for a database user
   */
  static generatePassword() {
    return passwordGenerator.generate({ length: 32, numbers: true });
  }

  /**
   * Initializes the models
   */
  static async initModels() {
    if (Object.keys(this.models).length) {
      return this.models;
    }

    const modelPattern = path.resolve(__dirname, '../models/*.js');

    const files = await new Promise((resolve, reject) => {
      glob(modelPattern, (err, files) => {
        if (err) return reject(err);
        return resolve(files);
      });
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.includes('index.js')) {
        continue;
      }

      const modelFunc = require(file);

      const model = await modelFunc(this.connection, Sequelize.DataTypes);
      this.models[model.name] = model;
    }

    for (const name in this.models) {
      const Model = this.models[name];

      if (Model.associate) {
        Model.associate(this.models);
      }
    }
    console.log('Finished initializing models');
    return this.models;
  }
}

export default Database;
