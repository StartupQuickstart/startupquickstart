import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelizeConfig from '@/sequelize';
import Files from '@/lib/files';

const models = {};

models.init = async () => {
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

  const parentPath = __dirname.split('node_modules')[0];
  const parentModelPaths = Files.findByExt(
    path.resolve(parentPath, 'src/api'),
    'model.js'
  );

  modelPaths.push(...parentModelPaths);

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

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;
};

module.exports = models;
