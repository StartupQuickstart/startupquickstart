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
      // callToAction={{
      //   title: 'BceCloud Beta',
      //   description:
      //     'This is a beta version of the BceCloud. You can still use the classic version.',
      //   actionTitle: 'Go to Classic',
      //   actionTo: 'https://www.bcecloud.com'
      // }}
      // config={{
      //   website: 'https://bestcorporateevents.com',
      //   legalName: 'Best Corporate Events Inc.',
      //   // supportPage:
      //   //   'https://github.com/StartupQuickstart/startupquickstart/issues',
      //   // privacyPolicy: 'https://app.startupquickstart.com/privacy-policy',
      //   // termsOfService: 'https://app.startupquickstart.com/privacy-policy',
      //   supportEmail: 'sales@bestcorporateevents.com',
      //   signup: {
      //     // heading: 'Register your 30-day unlimited-use free trial',
      //     // subheading: 'Start crowd sourcing your readers as proofreaders today.',
      //     optionalFields: ['first_name', 'last_name', 'company_name']
      //   },
      //   logo: {
      //     src: 'https://bestcorporateevents.com/app/uploads/2019/12/best-corporate-events-logo350x68.png',
      //     alt: 'Best Corporate Events Logo'
      //   }
      // }}
    />
  );
}

export default App;
