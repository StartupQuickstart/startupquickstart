import { EmptyLayout } from '@/components/layouts';
import * as views from '@/views';
import { routes as subscriptionRoutes } from './subscription.routes';
import { routes as authRoutes } from './auth.routes';

export const routes = [
  ...authRoutes,
  ...subscriptionRoutes,
  { path: '/error/:code', Component: views.Error, Layout: EmptyLayout }
];

export default routes;
