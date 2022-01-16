import { Private } from '@/components/authenticators';
import { EmptyLayout } from '@/components/layouts';
import * as views from 'views';

export const authRoutes = [
  { path: '/login', Component: views.auth.Login, Layout: EmptyLayout },
  {
    path: '/logout',
    Component: views.auth.Logout,
    Layout: EmptyLayout,
    Authenticator: Private
  },
  { path: '/signup', Component: views.auth.Signup, Layout: EmptyLayout },
  {
    path: '/activate',
    Component: views.auth.Activate,
    Layout: EmptyLayout,
    Authenticator: Private
  },
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

export default authRoutes;
