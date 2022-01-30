import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelizeConfig from '@/sequelize';
import Files from '@/lib/files';

export const models = {};
const defaultExport = {};

export const init = async () => {
  const config = (await sequelizeConfig()).default;

  let sequelize;
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
  }

  const modelPaths = Files.findByExt(path.resolve(__dirname, 'v1'), 'model.js');

  modelPaths.forEach((file) => {
    const init = require(file);
    const model = init(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  defaultExport.sequelize = sequelize;
  defaultExport.Sequelize = Sequelize;
};

defaultExport.models = models;
defaultExport.init = init;

export default defaultExport;
