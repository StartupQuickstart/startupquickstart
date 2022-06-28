import { PrivateWithProps } from './Private';

export function SubscriptionWithProps(props = {}) {
  return PrivateWithProps({ ...props, requireSubscription: true });
}

export const Subscription = SubscriptionWithProps();

export default Subscription;
