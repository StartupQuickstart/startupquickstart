import '@startupquickstart/react/assets/css/main.css';
import { Admin } from '@startupquickstart/react/templates';
import {
  Api,
  Auth
} from '@startupquickstart/react/lib/startupquickstart-server';

import { routes } from './routes';
import { useMemo } from 'react';

export function App() {
  const auth = useMemo(() => new Auth('v1'), []);

  return (
    <Admin
      Api={Api}
      Auth={auth}
      routes={routes}
      sidebarItems={[
        {
          name: '',
          items: [{ name: 'Dashboard', to: '/', icon: 'BarChart2' }]
        },
        {
          name: 'Admin',
          items: [
            { name: 'Users', to: '/users', icon: 'Users' },
            {
              name: 'Settings',
              to: '/settings',
              icon: 'Settings'
            }
          ]
        }
      ]}
    />
  );
}

export default App;
