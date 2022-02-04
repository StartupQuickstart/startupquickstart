import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from '@/context/ContextProvider';
import { coreRoutes } from '@/routes';
import { AdminLayout } from '@/components/layouts';
import * as views from '@/views';
import { Private, Public } from '@/components/authenticators';
import { PageLoading } from '@/components/common';
import axios from 'axios';

export function Admin({
  routes,
  Auth,
  Api,
  config,
  configPath,
  callToAction,
  features,
  sidebarItems
}) {
  const [_config, setConfig] = useState(config);

  useEffect(() => {
    if (configPath) {
      axios.get(configPath).then((result) => setConfig(result.data));
    }
  }, [configPath]);

  useEffect(() => {
    document.title = _config?.name;
  }, [_config?.name]);

  if (!routes) {
    routes = [
      { path: '/', Component: views.Home, Authenticator: Private },
      { path: '/page', Component: views.Page, Authenticator: Private }
    ];
  }

  routes.push(...coreRoutes);

  if (!_config && configPath) {
    return <PageLoading />;
  }

  return (
    <Router>
      <ContextProvider
        Auth={Auth}
        Api={Api}
        config={_config}
        callToAction={callToAction}
        features={features}
        sidebarItems={sidebarItems}
      >
        <Routes>
          {routes.map(
            (
              {
                path,
                Component,
                redirect = false,
                exact = false,
                Authenticator = Public,
                Layout = AdminLayout
              },
              index
            ) => {
              const Element = (props) => {
                return (
                  <Authenticator>
                    <Layout {...props}>
                      <ToastContainer />
                      {redirect && <Navigate repalce to={redirect} />}
                      {!redirect && <Component {...props} />}
                    </Layout>
                  </Authenticator>
                );
              };

              return (
                <Route
                  key={index}
                  path={path}
                  exact={exact}
                  element={<Element />}
                />
              );
            }
          )}
        </Routes>
      </ContextProvider>
    </Router>
  );
}

export default Admin;
