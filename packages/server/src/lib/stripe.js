import stripe from 'stripe';
import NodeCache from 'node-cache';
import path from 'path';
import fs from 'fs';
import config from '@/config';

let pricing = [];
const pricingPath = path.resolve(
  __dirname,
  `../../api/v1/pricing/pricing.${process.env.ENV}.js`
);

if (fs.existsSync(pricingPath)) {
  pricing = require(pricingPath).default || [];
}

const cache = new NodeCache({ useClones: false, stdTTL: 60 * 5 });

export class Stripe {
  /**
   * Converts a stripe timestamp toa  date
   *
   * @param {Integer} timestamp Timestamp to convert to date
   */
  static convertToDate(timestamp) {
    return timestamp ? new Date(timestamp * 1000) : null;
  }

  /**
   * Gets a stripe customer by its id
   *
   * @param {String} customerId Id for the customer
   * @param {Boolean} useCache Whether or not to use the cached customer
   */
  static async getCustomer(customerId, useCache = true) {
    return this.retrieve(
      'customers',
      customerId,
      { expand: ['subscriptions'] },
      useCache
    );
  }

  /**
   * Gets a stripe product by its id
   *
   * @param {String} productId Id for the product
   * @param {Boolean} useCache Whether or not to use the cached customer
   */
  static async getProduct(productId, useCache = true) {
    return this.retrieve('products', productId, {}, useCache);
  }

  /**
   * Gets a stripe customer by its id
   *
   * @param {String} customerId Id for the customer
   * @param {Boolean} useCache Whether or not to use the cached customer
   */
  static async getSubscriptions(customerId, useCache = true) {
    const customer = await this.getCustomer(customerId, useCache);
    return customer && customer.subscriptions
      ? customer.subscriptions.data
      : [];
  }

  /**
   * Gets a subscription status for a customer
   *
   * @param {String} customerId Id for the customer
   * @param {Boolean} useCache Whether or not to use cached data
   */
  static async getSubscriptionStatus(customerId, useCache = true) {
    const cacheId = `subscription_status_${customerId}`;

    if (useCache && cache.has(cacheId)) {
      return cache.get(cacheId);
    }

    const data = { products: {}, expired: {} };
    const subscriptions = await this.getSubscriptions(customerId, useCache);

    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      const subscriptionItems = subscription.items.data;
      const isCancelled =
        subscription.cancel_at && subscription.cancel_at * 1000 < Date.now();

      if (!isCancelled) {
        for (let j = 0; j < subscriptionItems.length; j++) {
          const subscriptionItem = subscriptionItems[j];
          const plan = subscriptionItem.plan;
          const productId = plan.product;

          const product = await this.getProduct(productId);
          const productConfig = pricing
            .filter((product) => product.productId === productId)
            .pop();

          const status = {
            id: productId,
            planId: plan.id,
            seats: productConfig.seats,
            productName: productConfig.productName,
            name: product.name,
            originalStartDate: this.convertToDate(subscription.start_date),
            startDate: this.convertToDate(subscription.current_period_start),
            endDate: this.convertToDate(subscription.current_period_end),
            trialStartDate: this.convertToDate(subscription.trial_start),
            trialEndDate: this.convertToDate(subscription.trial_end)
          };

          const now = new Date();

          status.onTrial =
            status.trialStartDate < now && status.trialEndDate > now;
          status.isExpired = status.endDate < now;
          status.status = subscription.status;
          status.isActive = ['active', 'trialing'].includes(
            subscription.status
          );
          status.isValid = !status.isExpired && status.isActive;
          status.cancelAt = subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000)
            : null;

          if (status.isValid) {
            data.products[status.productName] = status;
          } else {
            data.expired[status.productName] = status;
          }
        }
      }
    }

    data.hasValidSubscription = !!Object.keys(data.products).length;

    cache.set(cacheId, data);
    return data;
  }

  /**
   * Gets a stripe object by its id
   *
   * @param {String} objectName Name of the object
   * @param {String} id Id for the object
   * @param {Object} options Options to pass to retrieve
   * @param {Boolean} useCache Whether or not to use the cached
   */
  static async retrieve(objectName, id, options = {}, useCache = true) {
    const cacheId = `${objectName}_${id}`;

    if (useCache && cache.has(cacheId)) {
      return cache.get(cacheId);
    }

    if (!id || !config.stripe) {
      return null;
    }

    const _stripe = new stripe(config.stripe.apiKey);

    const record = await _stripe[objectName].retrieve(id, options);
    cache.set(cacheId, record);
    return record;
  }
}

export default Stripe;
