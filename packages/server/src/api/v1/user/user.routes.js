import express from 'express';
import Controller from './user.controller';
import Auth from '@/lib/auth';
import ApiRouter from '@/lib/api-route';

let router = express.Router();

const withAdminRole = Auth.withRole(['Admin', 'Super Admin']);

router.get('/users/me', Auth.protected(), Controller.readMe);
router.put('/users/me', Auth.protected(), Controller.updateMe);

router.get(
  '/users/:id/send-invite-email',
  [Auth.protected(), withAdminRole],
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
