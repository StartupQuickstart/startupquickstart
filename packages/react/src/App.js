import './assets/scss/light-blue.scss';
import Admin from './components/templates/Admin';
import { Auth } from './sample/auth';

export function App() {
  return <Admin Auth={Auth} />;
}

export default App;
