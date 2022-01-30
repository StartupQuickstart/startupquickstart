import { Private } from '@startupquickstart/react/authenticators';
import { Home } from '@startupquickstart/react/views';

export const routes = [{ path: '/', Component: Home, Authenticator: Private }];

export default routes;
