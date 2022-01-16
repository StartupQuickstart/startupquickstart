import { EmptyLayout } from '@/components/layouts';
import * as views from '../views';
import { routes as authRoutes } from './auth.routes';

export const routes = [
  ...authRoutes,
  { path: '/error/:code', Component: views.common.Error, Layout: EmptyLayout }
];

export default routes;
