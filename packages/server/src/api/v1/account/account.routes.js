import express from 'express';
import Controller from './account.controller';
import Auth from '@/lib/auth';
import ApiRouter from '@/lib/api-route';

let router = express.Router();

router.get('/accounts/me', Auth.protected(), Controller.readMe);
router.put('/accounts/me', Auth.protected(), Controller.updateMe);

router = new ApiRouter(
  'accounts',
  Controller,
  'Account',
  ['read', 'update'],
  [Auth.protectAccounts],
  router
);

export default router;
