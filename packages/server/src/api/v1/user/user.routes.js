import express from 'express';
import Controller from './user.controller';
import Auth from '@/lib/auth';
import ApiRouter from '@/lib/api-route';

let router = express.Router();

const withAdminRole = Auth.withRole(['Admin', 'Super Admin']);

router.get('/users/me', Auth.protected(['jwt']), Controller.readMe);
router.put('/users/me', Auth.protected(['jwt']), Controller.updateMe);

router.put(
  '/users/:id/send-invite-email',
  [Auth.protected(['jwt']), withAdminRole],
  Controller.inviteUser
);

router = new ApiRouter(
  'users',
  Controller,
  'User',
  ['index', 'update', 'create', 'describe'],
  [withAdminRole], // Middleware
  router
);

export default router;
