import './assets/scss/main.scss';
import Admin from '@/components/templates/Admin';

import { Auth, Api } from '@/lib/startupquickstart-server';

export function App() {
  return (
    <Admin Auth={new Auth('v1')} Api={Api} configPath={'/api/v1/config'} />
  );
}

export default App;
