import { Private } from '@/authenticators';
import { EmptyLayout } from '@/components/layouts';
import * as views from '@/views';

export const routes = [
  { path: '/login', Component: views.auth.Login, Layout: EmptyLayout },
  {
    path: '/logout',
    Component: views.auth.Logout,
    Layout: EmptyLayout,
    Authenticator: Private
  },
  { path: '/signup', Component: views.auth.Signup, Layout: EmptyLayout },
  {
    path: '/forgot-password',
    Component: views.auth.ForgotPassword,
    Layout: EmptyLayout
  },
  {
    path: '/reset-password',
    Component: views.auth.ResetPassword,
    Layout: EmptyLayout
  }
];

export default routes;
