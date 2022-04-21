import { promisify } from 'util';
import qs from 'qs';
import OAuth2Server, { OAuth2 } from './oauth2.server';
import Auth from '@/lib/auth';
import express from 'express';
import OAuthServer from 'express-oauth-server';
import { InvalidGrantError, Request, Response } from 'oauth2-server';
import axios from 'axios';

const router = express.Router();

router.post('/oauth2/authorize', async (req, res, next) => {
  try {
    return OAuth2Server.authorize({
      authenticateHandler: {
        handle: async (req, res) => {
          const { username, password } = req.body;
          const user = await promisify(OAuth2.getUser)(username, password);
          return user;
        }
      }
    })(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.post('/oauth2/token', OAuth2Server.token());

export default router;
