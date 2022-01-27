import http from 'http';
import passport from 'passport';
import Stripe from './stripe';

export class Auth {
  /**
   * Authenticates a user with the jwt passport strategy
   * Requires an admin user
   *
   * @param {Array} strategies Strategies to use
   */
  static admin(strategies = null) {
    return [
      Auth.protected(strategies),
      (req, res, next) => {
        if (req.user.role !== 'admin') {
          return res.status(403).send(http.STATUS_CODES[403]);
        }

        next();
      }
    ];
  }

  /**
   * Accepts any authentication
   *
   * @param {Array} strategies Strategies to use
   * @param {Array} scope Required scope to use path
   */
  static protected(
    strategies = null,
    requireSubscription = false,
    scope = 'api'
  ) {
    const hasStrategy = (strategy) =>
      !strategies ||
      (Array.isArray(strategies)
        ? strategies.includes(strategy)
        : strategies === strategy);

    const auth = (req, res, next) => {
      if (
        hasStrategy('jwt') &&
        ((req.headers.authorization &&
          req.headers.authorization.startsWith('bearer')) ||
          req.query.token ||
          req.body.token)
      ) {
        return passport.authenticate('jwt', { session: false, scope })(
          req,
          res,
          () => {
            if (!req.user.scope.includes(scope)) {
              res
                .status(403)
                .send({
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
              res
                .status(403)
                .send({
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

    return process.env.REQUIRE_SUBSCRIPTION === 'false' ||
      requireSubscription === false
      ? [auth]
      : [auth, Auth.validateSubscription];
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
  static async validateSubscription(req, res, next) {
    const status = await Stripe.getSubscriptionStatus(
      req.user.account.stripe_customer_id
    );

    if (!status.hasValidSubscription) {
      return res.status(403).send(http.STATUS_CODES[403]);
    }

    req.subscriptionStatus = status;

    next();
  }
}

export default Auth;
