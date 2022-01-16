import { EmptyLayout } from '@/components/layouts';
import * as views from '../views';
import authRoutes from './auth.routes';

export const coreRotues = [
  ...authRoutes,
  { path: '/error/:code', Component: views.common.Error, Layout: EmptyLayout }
];

export default coreRotues;
