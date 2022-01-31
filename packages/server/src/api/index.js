import { init as initModels, registerModels, findModels } from '@/api/models';

export async function init(app) {
  await initModels();
  const { init: initRoutes } = require('@/api/routes');
  await initRoutes(app);
}

export default {
  init,
  registerModels,
  findModels
};
