import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe } from '@/hooks';
import { PageLoading } from '@/components';
import { Toast } from '@/lib';

export function Billing({ className }) {
  const navigate = useNavigate();
  const { getBillingPortalSession, hasValidSubscription, isLoading } =
    useStripe();

  async function componentDidMount() {
    try {
      if (isLoading) {
        return;
      }

      if (!hasValidSubscription) {
        return navigate('/checkout');
      }

      const session = await getBillingPortalSession();

      if (session?.url) {
        window.location.href = session.url;
      } else {
        Toast.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.log(err);

      if (
        err.response &&
        err.response.data &&
        err.response.data.code === 'MISSING_SUBSCRIPTION'
      ) {
        navigate('/checkout');
      }

      Toast.error(`Failed to get billing portal session: ${err.message}`);
    }
  }

  useEffect(() => {
    componentDidMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return <PageLoading />;
}

export default Billing;
