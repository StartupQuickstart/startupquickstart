import express from 'express';
import fs from 'fs';
import path from 'path';

let pricing = [];
const pricingPath = path.resolve(
  __dirname,
  `../../../../api/v1/pricing/pricing.${process.env.ENV}.js`
);

if (fs.existsSync(pricingPath)) {
  pricing = require(pricingPath).default || [];
}

const router = express.Router();

router.get('/pricing', (req, res) => {
  return res.status(200).send(pricing);
});

export default router;
