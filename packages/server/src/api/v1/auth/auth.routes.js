import express from 'express';
import Controller from './auth.controller';
import auth from '../../../lib/auth';
import passport from 'passport';

const router = express.Router();

router.post(
  '/auth/authorize',
  passport.authenticate('local', { session: false }),
  Controller.authorize
);

router.post('/auth/signup', Controller.signup);
router.post('/auth/forgot-password', Controller.forgotPassword);
router.post(
  '/auth/reset-password',
  auth.protected('bearer', false, 'reset_password'),
  Controller.resetPassword
);
router.post(
  '/auth/send-activation-email',
  auth.protected(),
  Controller.sendActivationEmail
);
router.post('/auth/activate', auth.protected(), Controller.activate);
router.post('/auth/refresh', auth.protected(), Controller.refresh);

router.post(
  '/auth/change-password',
  auth.protected(),
  Controller.resetPassword
);

export default router;
