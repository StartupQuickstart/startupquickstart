import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelizeConfig from '@/sequelize';
import Files from '@/lib/files';

export const models = {};

export async function init() {
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

  const modelPaths = Files.findByExt(path.resolve(__dirname), 'model.js');

  const parentPath = process.cwd();
  const dir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const parentModelPaths = Files.findByExt(
    path.resolve(parentPath, dir, 'api'),
    'model.js'
  );

  modelPaths.push(...parentModelPaths);

  modelPaths.forEach((file) => {
    const init = require(file);

    if (init && typeof init === 'function') {
      const model = init(sequelize, Sequelize.DataTypes);
      models[model.name] = model;
    }
  });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;
}

export default models;
