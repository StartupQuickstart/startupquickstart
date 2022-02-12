export { models, init as initModels } from '@/api/models';
import { init as initModels, models } from '@/api/models';

export async function init(app) {
  await initModels();
  const { init: initRoutes } = require('@/api/routes');
  await initRoutes(app);
}

export default {
  init,
  initModels,
  models
};
