import http from 'http';
import passport from 'passport';
import Stripe from './stripe';
import { auth } from 'express-oauth2-jwt-bearer';

const checkJwt = auth({
  audience: 'https://api.remersivestudios.com',
  issuerBaseURL: `https://remersivestudios.us.auth0.com/`
});

export class Auth {
  /**
   * Returns middleware to protect a route
   */
  static protected() {
    return [checkJwt];
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
      return res.status(403).send(http.STATUS_CODES[403]);
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

export default Auth;
