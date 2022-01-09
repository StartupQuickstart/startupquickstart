import './assets/scss/main.scss';
import { Private } from './components/authenticators';
import EmptyLayout from './components/layouts/Empty';
import Admin from './components/templates/Admin';
import { Home, Auth } from './views';

function App() {
  const routes = [
    { path: '/', Component: Home, Authenticator: Private },
    { path: '/login', Component: Auth.Login, Layout: EmptyLayout },
    {
      path: '/logout',
      Component: Auth.Logout,
      Layout: EmptyLayout,
      Authenticator: Private
    },
    { path: '/signup', Component: Auth.Signup, Layout: EmptyLayout },
    {
      path: '/activate',
      Component: Auth.Activate,
      Layout: EmptyLayout,
      Authenticator: Private
    },
    {
      path: '/forgot-password',
      Component: Auth.ForgotPassword,
      Layout: EmptyLayout
    },
    {
      path: '/reset-password',
      Component: Auth.ResetPassword,
      Layout: EmptyLayout
    }
  ];

  return <Admin routes={routes} />;
}

export default App;
