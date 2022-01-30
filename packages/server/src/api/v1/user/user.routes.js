import express from 'express';
import Controller from './user.controller';
import Auth from '@/lib/auth';
import ApiRoute from '@/lib/api-route';
import ApiDoc from '@/lib/api-doc';

export let router = express.Router();

router.get('/users/me', Auth.protected(['jwt']), Controller.readMe);
router.put('/users/me', Auth.protected(['jwt']), Controller.updateMe);

const config = {
  path: 'users',
  controller: Controller,
  modelName: 'User',
  routes: ['index', 'update', 'create', 'describe'],
  router: router
};

router = ApiRoute(config);
export const docs = ApiDoc(config);

export default router;
