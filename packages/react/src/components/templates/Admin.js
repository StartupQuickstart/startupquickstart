import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from '@/context/ContextProvider';
import coreRoutes from '@/routes/core.routes';
import AdminLayout from '@/components/layouts/Admin';
import * as views from '@views';
import { Private, Public } from '@/components/authenticators';

export function Admin({
  routes,
  Auth,
  Api,
  config,
  callToAction,
  features,
  sidebarItems
}) {
  if (!routes) {
    routes = [{ path: '/', Component: views.Home, Authenticator: Private }];
  }

  routes.push(...coreRoutes);

  return (
    <Router>
      <ContextProvider
        Auth={Auth}
        Api={Api}
        config={config}
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
