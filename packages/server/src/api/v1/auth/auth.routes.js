import express from 'express';
import Controller from './auth.controller';
import { middleware } from '@/lib/auth';
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
  middleware.resetPassword,
  Controller.resetPassword
);
router.post(
  '/auth/send-activation-email',
  middleware.withoutSubscription,
  Controller.sendActivationEmail
);
router.post(
  '/auth/activate',
  middleware.withoutSubscription,
  Controller.activate
);
router.post(
  '/auth/refresh',
  middleware.withoutSubscription,
  Controller.refresh
);

router.post(
  '/auth/change-password',
  middleware.withoutSubscription,
  Controller.resetPassword
);

export default router;
