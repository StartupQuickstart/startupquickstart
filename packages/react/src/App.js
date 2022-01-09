import './assets/scss/main.scss';
import Admin from './components/templates/Admin';
import Home from './views/Home';

function App() {
  const routes = [{ path: '/', Component: Home }];

  return <Admin routes={routes} />;
}

export default App;
