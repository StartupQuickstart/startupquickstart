import { AdminLayout } from '@/components/layouts';
import * as views from '@/views';

export const routes = [
  {
    path: '/checkout',
    Component: views.subscription.Checkout,
    Layout: AdminLayout
  },
  {
    path: '/billing',
    Component: views.subscription.Billing,
    Layout: AdminLayout
  }
];

export default routes;
