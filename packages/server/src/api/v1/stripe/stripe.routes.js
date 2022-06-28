import express from 'express';
import Controller from './stripe.controller';
import auth from '../../../lib/auth';

const router = express.Router();

const authMiddleware = auth.protected();

router.post(
  '/stripe/checkout/session/new',
  authMiddleware,
  Controller.getNewCheckoutSession
);
router.post(
  '/stripe/checkout/session/process',
  authMiddleware,
  Controller.processSession
);

router.post(
  '/stripe/billing-portal/session',
  authMiddleware,
  Controller.getBillingPortalSession
);

router.get(
  '/stripe/subscription/status',
  authMiddleware,
  Controller.getSubscriptionStatus
);

export default router;
