import { Private } from '../components/authenticators';
import { EmptyLayout } from '../components/layouts';
import * as Views from '../views';

export const authRoutes = [
  { path: '/login', Component: Views.Auth.Login, Layout: EmptyLayout },
  {
    path: '/logout',
    Component: Views.Auth.Logout,
    Layout: EmptyLayout,
    Authenticator: Private
  },
  { path: '/signup', Component: Views.Auth.Signup, Layout: EmptyLayout },
  {
    path: '/activate',
    Component: Views.Auth.Activate,
    Layout: EmptyLayout,
    Authenticator: Private
  },
  {
    path: '/forgot-password',
    Component: Views.Auth.ForgotPassword,
    Layout: EmptyLayout
  },
  {
    path: '/reset-password',
    Component: Views.Auth.ResetPassword,
    Layout: EmptyLayout
  }
];

export default authRoutes;
