import Database from '@/lib/database';
import { config, loadConfig } from '@/config';

module.exports = async () => {
  const { database } = await loadConfig();

  const useSsl = database.host !== 'localhost';

  return {
    default: {
      username: database.username,
      password: database.password,
      database: database.dbname,
      host: database.host,
      port: database.port,
      dialect: database.engine,
      schema: 'app',
      searchPath: 'app',
      ssl: useSsl,
      logging: false,
      dialectOptions: {
        ssl: useSsl && { rejectUnauthorized: false },
        prependSearchPath: true
      },
      migrationStorageTableName: 'sequelize_migrations',
      seederStorage: 'sequelize',
      seederStorageTableName: 'sequelize_seeds',
      hooks: {
        afterConnect: async (conn) => {
          await conn.query(`SET ROLE ${database.dbname}`);
        }
      }
    }
  };
};
