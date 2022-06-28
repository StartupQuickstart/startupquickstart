import http from 'http';
import Stripe from '@/lib/stripe';
import config from '@/config';
import NodeCache from 'node-cache';
import models from '@/api/models';

const cache = new NodeCache();

export default class SubscriptionController {
  /**
   * Gets a new checkout session
   *
   * @param {HttpRequest} req Http request from client
   * @param {HttpResponse} res Http response to send to client
   */
  static async getNewCheckoutSession(req, res) {
    try {
      const account = req.user.account;
      const customerId = await account.getStripeCustomerId();

      const options = {
        payment_method_types: ['card'],
        subscription_data: {
          trial_period_days: 14,
          items: [
            {
              plan: req.body.planId
            }
          ]
        },
        allow_promotion_codes: true,
        success_url: `${config.server.publicHost}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.server.publicHost}/checkout`
      };

      if (customerId) {
        options.customer = customerId;
        options.client_reference_id = customerId;
      } else {
        options.customer_email = req.user.email;
      }

      const session = await Stripe.connection().checkout.sessions.create(
        options
      );
      session.publishableKey = config.stripe.publishableKey;

      res.status(200).send(session);
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }

  /**
   * Gets the subscription status for the user
   *
   * @param {HttpRequest} req Http request from client
   * @param {HttpResponse} res Http response to send to client
   */
  static async getSubscriptionStatus(req, res) {
    try {
      const account = req.user.account;
      const customerId = await account.getStripeCustomerId();

      const status = await Stripe.getSubscriptionStatus(
        customerId,
        req.query.cache === false || req.query.cache === 'false'
      );

      res.status(200).send(status);
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }

  /**
   * Gets an a billing portal session
   *
   * @param {HttpRequest} req Http request from client
   * @param {HttpResponse} res Http response to send to client
   */
  static async getBillingPortalSession(req, res) {
    try {
      const account = req.user.account;
      const customerId = await account.getStripeCustomerId();

      const session = await Stripe.connection().billingPortal.sessions.create({
        customer: customerId,
        return_url: config.server.publicHost
      });

      res.status(200).send(session);
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }

  /**
   * Processes a session
   *
   * @param {HttpRequest} req Http request from client
   * @param {HttpResponse} res Http response to send to client
   */
  static async processSession(req, res) {
    try {
      const stripe = Stripe.connection();
      const session = await stripe.checkout.sessions.retrieve(
        req.body.sessionId
      );
      const account = req.user.account;

      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        if (!account.stripe_customer_id) {
          account.stripe_customer_id = subscription.customer;

          await models.Account.update(
            { stripe_customer_id: subscription.customer },
            { where: { id: account.id } }
          );
        }
      } else if (session.setup_intent) {
        const intent = await Stripe.setupIntents.retrieve(session.setup_intent);

        if (account.stripe_customer_id === intent.metadata.customer_id) {
          await Promise.all([
            stripe.paymentMethods.attach(intent.payment_method, {
              customer: intent.metadata.customer_id
            }),
            stripe.customers.update(intent.metadata.customer_id, {
              invoice_settings: {
                default_payment_method: intent.payment_method
              }
            }),
            stripe.subscriptions.update(intent.metadata.subscription_id, {
              default_payment_method: intent.payment_method
            })
          ]);
        }
      }

      const subscription = await Stripe.getSubscriptionStatus(
        account.stripe_customer_id,
        false
      );

      res.status(200).send(subscription);
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }
}
