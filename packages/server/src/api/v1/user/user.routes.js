import express from 'express';
import Controller from './user.controller';
import Auth from '@/lib/auth';
import ApiRouter from '@/lib/api-route';

let router = express.Router();

router.get('/users/me', Auth.protected(['jwt']), Controller.readMe);
router.put('/users/me', Auth.protected(['jwt']), Controller.updateMe);

router = new ApiRouter(
  'users',
  Controller,
  'User',
  ['index', 'update', 'create', 'describe'],
  [Auth.withRole(['Admin', 'Super Admin'])], // Middleware
  router
);

export default router;
