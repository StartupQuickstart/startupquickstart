import React, { useEffect } from 'react';
import { Pricing } from '@/components/pricing';
import { useNavigate, useParams } from 'react-router-dom';
import { useStripe } from '@/hooks';

export function Checkout({ className }) {
  const params = useParams();
  const navigate = useNavigate();
  const { hasValidSubscription, processSessionId, checkout, isLoading } =
    useStripe();

  async function componentDidMount() {
    if (isLoading) {
      return;
    }

    if (hasValidSubscription) {
      return navigate('/billing');
    }

    if (params.session_id) {
      const subscription = await processSessionId(params.session_id);

      if (subscription && subscription.hasValidSubscription) {
        return navigate('/');
      }
    }

    if (params.plan_id) {
      return checkout(params.plan_id);
    }
  }

  useEffect(() => {
    componentDidMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return <Pricing />;
}

export default Checkout;
