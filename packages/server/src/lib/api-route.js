import express from 'express';
import auth from './auth';
import { apiQueryParser, parseJson } from './api-request-middleware';
import { validate, countSchema, indexSchema, readSchema } from './api-schema';

export const defaultRoutes = [
  'index',
  'create',
  'read',
  'update',
  'delete',
  'count',
  'related',
  'addRelated',
  'removeRelated',
  'describe',
  'createBulk',
  'bulkAddRelated'
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
    router.get(
      `/${path}/count`,
      [...middleware, validate(countSchema(controller.model))],
      controller.count
    );
  }

  if (routes.includes('describe')) {
    router.get(`/${path}/describe`, [...middleware], controller.describe);
  }

  if (routes.includes('index')) {
    router.get(
      `/${path}`,
      [
        ...middleware,
        (req, res, next) => {
          if (req.query.order) {
            req.query.order = parseJson(req.query.order);
          }
          next();
        },
        validate(indexSchema(controller.model))
      ],
      controller.index
    );
  }

  if (routes.includes('create')) {
    router.post(`/${path}`, [...middleware], controller.create);
  }

  if (routes.includes('bulkCreate')) {
    router.post(`/${path}/bulk`, [...middleware], controller.bulkCreate);
  }

  if (routes.includes('read')) {
    router.get(
      `/${path}/:id`,
      [...middleware, validate(readSchema(controller.model))],
      controller.read
    );
  }

  if (routes.includes('update')) {
    router.put(`/${path}/:id`, [...middleware], controller.update);
  }

  if (routes.includes('delete')) {
    router.delete(`/${path}/:id`, [...middleware], controller.delete);
  }

  if (routes.includes('related')) {
    router.get(`/${path}/:id/related/:related`, middleware, controller.related);
  }

  if (routes.includes('bulkAddRelated')) {
    router.post(
      `/${path}/:id/related/:related/bulk`,
      [...middleware],
      controller.bulkAddRelated
    );
  }

  if (routes.includes('addRelated')) {
    router.post(
      `/${path}/:id/related/:related`,
      [...middleware],
      controller.addRelated
    );
  }

  if (routes.includes('removeRelated')) {
    router.delete(
      `/${path}/:id/related/:related/:relatedId`,
      [...middleware],
      controller.removeRelated
    );
  }

  return router;
}

export default ApiRoute;
