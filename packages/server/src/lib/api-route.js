import express from 'express';
import auth from './auth';
import { apiQueryParser } from './api-request-middleware';

export const defaultRoutes = [
  'index',
  'create',
  'read',
  'update',
  'delete',
  'count',
  'related',
  'describe'
];

export function ApiRoute(
  path,
  controller,
  modelName,
  routes = defaultRoutes,
  middleware = [],
  router,
  options = {}
) {
  const opts = Object.assign({ isPublic: false }, options);
  router = router || express.Router();

  middleware.unshift(apiQueryParser(modelName));

  if (!opts.isPublic) {
    middleware.unshift(auth.protected());
  }

  if (routes.includes('count')) {
    router.get(`/${path}/count`, middleware, controller.count);
  }

  if (routes.includes('describe')) {
    router.get(`/${path}/describe`, middleware, controller.describe);
  }

  if (routes.includes('index')) {
    router.get(`/${path}`, middleware, controller.index);
  }

  if (routes.includes('create')) {
    router.post(`/${path}`, middleware, controller.create);
  }

  if (routes.includes('read')) {
    router.get(`/${path}/:id`, middleware, controller.read);
  }

  if (routes.includes('update')) {
    router.put(`/${path}/:id`, middleware, controller.update);
  }

  if (routes.includes('delete')) {
    router.delete(`/${path}/:id`, middleware, controller.delete);
  }

  if (routes.includes('related')) {
    router.get(`/${path}/:id/related/:related`, middleware, controller.related);
  }

  return router;
}

export default ApiRoute;
