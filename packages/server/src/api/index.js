import path from 'path';
import { init as initModels } from '@/api/models';
import { init as initDocs } from '@/api/docs';

export async function init(app) {
  await initModels();
  const { init: initRoutes } = require('@/api/routes');
  await initRoutes(app);
  await initDocs(app);
}

export default {
  init
};
