import Database from '@/lib/database';

module.exports = async () => {
  const creds = await Database.getCredentials('svc_app');

  return {
    default: {
      username: creds.username,
      password: creds.password,
      database: creds.dbname,
      host: creds.host,
      port: creds.port,
      dialect: creds.engine,
      schema: 'app',
      searchPath: 'app',
      ssl: true,
      logging: false,
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
        prependSearchPath: true
      },
      migrationStorageTableName: 'sequelize_migrations',
      seederStorage: 'sequelize',
      seederStorageTableName: 'sequelize_seeds',
      hooks: {
        afterConnect: async (conn) => {
          await conn.query(`SET ROLE ${creds.dbname}`);
        }
      }
    }
  };
};
