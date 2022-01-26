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
      const customerId = account.stripe_customer_id;

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

      const session = await Stripe.stripe.checkout.sessions.create(options);
      session.publishableKey = config.stripe.publishableKey;

      res.status(200).send(session);
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }

  /**
   * Gets the pricing for the ap
   *
   * @param {HttpRequest} req Http request from client
   * @param {HttpResponse} res Http response to send to client
   */
  static async getPricing(req, res) {
    try {
      if (cache.has('pricing')) {
        return res.status(200).send(cache.get('pricing'));
      }

      const pricing = config.pricing;

      for (let i = 0; i < pricing.length; i++) {
        const product = pricing[i];
        const [monthly, yearly] = await Promise.all([
          Stripe.stripe.plans.retrieve(product.stripe.monthlyPlanId),
          Stripe.stripe.plans.retrieve(product.stripe.yearlyPlanId)
        ]);

        product.monthly = monthly.amount / 100;
        product.yearly = yearly.amount / 100;
      }

      cache.set('pricing', pricing);

      res.status(200).send(pricing);
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }

  /**
   * Gets products from stripe
   *
   * @param {HttpRequest} req Http request from client
   * @param {HttpResponse} res Http response to send to client
   */
  static async getProducts(req, res) {
    try {
      const products = await Stripe.stripe.products.list();
      res.status(200).send(products.data);
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }

  /**
   * Gets plans for a produt
   *
   * @param {HttpRequest} req Http request from client
   * @param {HttpResponse} res Http response to send to client
   */
  static async getPlansForProduct(req, res) {
    try {
      const plans = await Stripe.stripe.plans.list({
        product: req.params.productId
      });
      res.status(200).send(plans.data);
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

      const status = await Stripe.getSubscriptionStatus(
        account.stripe_customer_id,
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
      const customerId =
        req.user && req.user.account
          ? req.user.account.stripe_customer_id
          : null;

      if (!customerId) {
        return res.status(400).send({
          code: 'MISSING_SUBSCRIPTION',
          message: 'Missing Subscription'
        });
      }

      const session = await Stripe.stripe.billingPortal.sessions.create({
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
      const session = await Stripe.stripe.checkout.sessions.retrieve(
        req.body.sessionId
      );
      const account = req.user.account;

      if (session.subscription) {
        const subscription = await Stripe.stripe.subscriptions.retrieve(
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
            Stripe.stripe.paymentMethods.attach(intent.payment_method, {
              customer: intent.metadata.customer_id
            }),
            Stripe.stripe.customers.update(intent.metadata.customer_id, {
              invoice_settings: {
                default_payment_method: intent.payment_method
              }
            }),
            Stripe.stripe.subscriptions.update(
              intent.metadata.subscription_id,
              {
                default_payment_method: intent.payment_method
              }
            )
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
