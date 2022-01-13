import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContextProvider } from '../../context/ContextProvider';
import authRoutes from '../../routes/auth.routes';
import AdminLayout from '../layouts/Admin';
import * as Views from '../../views';
import { Private, Public } from '../authenticators';

export function Admin({ routes, Auth }) {
  if (!routes) {
    routes = [{ path: '/', Component: Views.Home, Authenticator: Private }];
  }

  routes.push(...authRoutes);

  return (
    <Router>
      <ContextProvider Auth={Auth}>
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
