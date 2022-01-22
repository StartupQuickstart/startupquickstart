import express from 'express';
import Auth from '@/lib/auth';
import Controller from './system-setting.controller';

const router = new express.Router();

router.get(
  `/system-settings/features`,
  Auth.protected(),
  Controller.getFeatures
);
router.put(
  `/system-settings/features/:name`,
  Auth.protected(),
  Controller.enableFeature
);

export default router;
