import http from 'http';
import fs from 'fs';
import path from 'path';

import AccountRoutes from './v1/account/account.routes';
import AuthRoutes from './v1/auth/auth.routes';
import ConfigRoutes from './v1/config/config.routes';
import MediaRoutes from './v1/media/media.routes';
import MediaFileRoutes from './v1/media/media.file.routes';
import OAuth2Routes from './v1/oauth2/oauth2.routes';
import OAuth2ClientRoutes from './v1/oauth2/oauth2-client.routes';
import PricingRoutes from './v1/pricing/pricing.routes';
import StripeRoutes from './v1/stripe/stripe.routes';
import SystemSettingRoutes from './v1/system-setting/system-setting.routes';
import UserRoutes from './v1/user/user.routes';
import { ValidationError } from 'sequelize';
import config from '@/config';

export function init(app) {
  const parentPath = process.cwd();
  const dir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const parentRoutePath = path.resolve(parentPath, dir, 'api/routes.js');

  if (parentRoutePath !== __filename && fs.existsSync(parentRoutePath)) {
    require(parentRoutePath).default(app);
  }

  app.use('/media', MediaFileRoutes);
  app.use('/api/v1', AccountRoutes);
  app.use('/api/v1', AuthRoutes);
  app.use('/api/v1', ConfigRoutes);
  app.use('/api/v1', MediaRoutes);
  app.use('/api/v1', OAuth2ClientRoutes);
  app.use('/api/v1', OAuth2Routes);
  app.use('/api/v1', PricingRoutes);
  app.use('/api/v1', StripeRoutes);
  app.use('/api/v1', SystemSettingRoutes);
  app.use('/api/v1', UserRoutes);

  app.use('/api/v1', (err, req, res, next) => {
    try {
      if (res.headersSent) {
        return next(err);
      }

      if (err instanceof ValidationError) {
        const errors = {};
        err.errors.forEach((error) => {
          let message;
          switch (error.validatorKey) {
            case 'isEmail':
              message = 'Please enter a valid email';
              break;
            case 'isDate':
              message = 'Please enter a valid date';
              break;
            case 'len':
              if (error.validatorArgs[0] === error.validatorArgs[1]) {
                message = 'Use ' + error.validatorArgs[0] + ' characters';
              } else {
                message =
                  'Use between ' +
                  error.validatorArgs[0] +
                  ' and ' +
                  error.validatorArgs[1] +
                  ' characters';
              }
              break;
            case 'min':
              message =
                'Use a number greater or equal to ' + error.validatorArgs[0];
              break;
            case 'max':
              message =
                'Use a number less or equal to ' + error.validatorArgs[0];
              break;
            case 'isInt':
              message = 'Please use an integer number';
              break;
            case 'is_null':
              message = 'Please complete this field';
              break;
            case 'not_unique':
              message = error.value + ' is taken. Please choose another one';
              error.path = error.path.replace('_UNIQUE', '');
          }
          errors[error.path] = message;
        });

        return res.status(400).send({ success: false, errors });
      }

      if (err.statusCode) {
        return res.status(err.statusCode).send(err);
      }

      console.log(err);
      return res.status(500).send(http.STATUS_CODES[500]);
    } catch (err) {
      console.log(err);
      return res.status(500).send(http.STATUS_CODES[500]);
    }
  });

  app.use('/api/?*', (req, res) => {
    return res.status(404).send(http.STATUS_CODES[404]);
  });
}

export default { init };
