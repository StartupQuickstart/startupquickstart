import { useApi, useConfig } from '@/context';
import { Toast } from '@/lib';
import { useCallback, useEffect, useState } from 'react';

export function useStripe() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const { config } = useConfig();
  const { Api } = useApi();

  /**
   * Sends user to checkout
   * @param {String} planId The plan id to subscribe to.
   */
  const checkout = useCallback(
    async (planId) => {
      if (!config?.stripe?.publishableKey) {
        Toast.error('Stripe is not configured');
        return;
      }

      const session = await getNewCheckoutSession(planId);
      const stripe = window.Stripe(config.stripe.publishableKey);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config?.stripe?.publishableKey]
  );

  /**
   * Gets a stripe checkout session for new subscriptions
   * @param {String} planId Id of the plan to get session for
   */
  const getNewCheckoutSession = useCallback(async (planId = {}) => {
    const res = await Api.get('stripe').axios.post(
      'checkout/session/new',
      {
        planId
      },
      { cache: false }
    );
    return res.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Gets the account status for the logged in user
   * @param {Object} params Url params to pass with request
   */
  const getSubscriptionStatus = useCallback(async (params = {}) => {
    if (!config.hasSubscriptions) {
      return false;
    }

    const res = await Api.get('stripe').axios.get(
      'subscription/status',
      {
        params
      },
      { cache: true }
    );
    return res.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Gets a stripe billing portal session
   */
  const getBillingPortalSession = useCallback(async () => {
    const res = await Api.get('stripe').axios.post(
      'billing-portal/session',
      {}
    );
    return res.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sends a session id to the server for processing
   * @param {String} sessionId Id of the session to process
   */
  const processSessionId = useCallback(async (sessionId) => {
    const res = await Api.get('stripe').axios.post(
      'checkout/session/process',
      {
        sessionId
      },
      { cache: false }
    );
    return res.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSubscriptionStatus()
      .then(setSubscriptionStatus)
      .then(() => setIsLoading(false));
  }, [getSubscriptionStatus, config.hasSubscriptions]);

  return {
    checkout,
    getBillingPortalSession,
    getNewCheckoutSession,
    getSubscriptionStatus,
    processSessionId,
    isLoading,
    subscriptionStatus,
    hasValidSubscription: subscriptionStatus?.hasValidSubscription
  };
}

export default useStripe;
