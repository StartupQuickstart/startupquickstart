import express from 'express';
import Controller from './oauth2-client.controller';
import Auth from '@/lib/auth';
import ApiRouter from '@/lib/api-route';

let router = express.Router();

router = new ApiRouter(
  'oauth/clients',
  Controller,
  'OAuth2Client',
  ['read', 'create', 'index', 'update', 'describe'],
  null,
  router
);

export default router;
