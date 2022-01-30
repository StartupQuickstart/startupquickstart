import Controller from './media.controller';
import Auth from '@/lib/auth';
import ApiRoute from '@/lib/api-route';
import ApiDoc from '@/lib/api-doc';

const config = {
  path: 'media',
  controller: Controller,
  modelName: 'Media',
  routes: ['index', 'create', 'read', 'delete']
};

export const router = ApiRoute(config);
export const docs = ApiDoc(config);

export default router;
