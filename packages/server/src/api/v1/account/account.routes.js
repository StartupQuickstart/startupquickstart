import express from 'express';
import Controller from './account.controller';

import Auth from '@/lib/auth';
import ApiRoute from '@/lib/api-route';
import ApiDoc from '@/lib/api-doc';

export let router = express.Router();

router.get('/accounts/me', Auth.protected(['jwt']), Controller.readMe);
router.put('/accounts/me', Auth.protected(['jwt']), Controller.updateMe);

const config = {
  path: 'accounts',
  controller: Controller,
  modelName: 'Account',
  routes: ['read', 'update'],
  middleware: [Auth.protectAccounts],
  router
};

router = ApiRoute(config);
export const docs = ApiDoc(config);

export default router;
