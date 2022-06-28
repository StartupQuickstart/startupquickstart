import http from 'http';
import passport from 'passport';
import Stripe from './stripe';
import config from '@/config';

export class Auth {
  /**
   * Accepts any authentication
   *
   * @param {Array} strategies Strategies to use
   * @param {Array} scope Required scope to use path
   */
  static protected(options) {
    const { strategies, scope, requireSubscription } = Object.assign(
      {
        strategies: ['bearer'],
        scope: 'api',
        requireSubscription:
          options?.requireSubscription === undefined
            ? config.requireSubscription
            : options.requireSubscription
      },
      options
    );

    const hasStrategy = (strategy) =>
      Array.isArray(strategies)
        ? strategies.includes(strategy)
        : strategies === strategy;

    const auth = (req, res, next) => {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (
        hasStrategy('bearer') &&
        (authHeader?.toLowerCase().startsWith('bearer') ||
          req.query.token ||
          req.body.token)
      ) {
        return passport.authenticate('jwt', { session: false, scope })(
          req,
          res,
          () => {
            if (!req.user.scope.includes(scope)) {
              res.status(403).send({
                success: false,
                message: 'Invalid Scope.',
                code: 'INVALID_SCOPE'
              });
            }

            return next();
          }
        );
      }

      if (hasStrategy('jwtCookie') && req.cookies['api-token']) {
        req.headers.authorization = `bearer ${req.cookies['api-token']}`;

        return passport.authenticate('jwt', { session: false, scope })(
          req,
          res,
          () => {
            if (!req.user.scope.includes(scope)) {
              res.status(403).send({
                success: false,
                message: 'Invalid Scope.',
                code: 'INVALID_SCOPE'
              });
            }

            return next();
          }
        );
      }

      res.status(401).send(http.STATUS_CODES[401]);
    };

    return requireSubscription ? [auth, Auth.withSubscription] : [auth];
  }

  /**
   * Authenticates a user with an api token
   */
  static apiToken() {
    return passport.authenticate('apiToken', {
      session: false
    });
  }

  /**
   * Middleware to protect accounts. Limits reads/puts/deletes to accounts with the users account id
   * And limits indexs to the account the user belongs to
   */
  static protectAccounts(req, res, next) {
    if (req.params.id && `${req.params.id}` !== `${req.user.account.id}`) {
      return res.status(403).send(http.STATUS_CODES[403]);
    }

    req.query.filter.id = req.user.account.id;

    next();
  }

  /**
   * Middleware taht validates a subscription
   */
  static async withSubscription(req, res, next) {
    const status = await Stripe.getSubscriptionStatus(
      req.user.account.stripe_customer_id
    );

    if (!status.hasValidSubscription) {
      return res.status(403).send({
        success: false,
        message: 'You must have a valid subscription to use this feature.',
        code: 'INVALID_SUBSCRIPTION'
      });
    }

    req.subscriptionStatus = status;

    next();
  }

  /**
   * Requires a user to have a specific role
   *
   * @param {Array} roles Roles to require
   */
  static withRole(roles) {
    if (!Array.isArray(roles)) {
      throw new Error('Roles must be an array');
    }

    return (req, res, next) => {
      if (!roles.some((role) => req.user.roles.includes(role))) {
        return res.status(403).send(http.STATUS_CODES[403]);
      }

      next();
    };
  }
}

export const middleware = {
  resetPassword: Auth.protected({
    requireSubscription: false,
    scope: 'reset_password'
  }),
  withoutSubscription: Auth.protected({
    requireSubscription: false
  }),
  withSubscription: Auth.protected({
    requireSubscription: true
  })
};

Auth.middleware = middleware;

export default Auth;
