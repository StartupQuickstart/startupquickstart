import express from 'express';
import config from '@/config';

const router = express.Router();

router.get('/config', (req, res) => {
  res.send({
    name: config.app.name,
    legalName: config.app.legalName,
    website: config.app.website,
    termsOfService: config.app.termsOfService,
    privacyPolicy: config.app.privacyPolicy,
    address: config.app.address,
    supportEmail: config.app.supportEmail,
    logo: config.app.logo,
    host: config.server.host,
    pricing: config.app.pricing,
    setupItems: config.app.setupItems
  });
});

export default router;
