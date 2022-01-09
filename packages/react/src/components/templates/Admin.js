import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalProvider } from '../../context/global/provider';
import Public from '../auth-wrappers/Public';
import AdminLayout from '../layouts/Admin';

export default function Admin({ routes }) {
  if (!routes) {
    throw new Error('routes property require for Admin Component');
  }

  return (
    <GlobalProvider>
      <Router>
        <Routes>
          {routes.map(
            (
              {
                path,
                Component,
                redirect = false,
                exact = false,
                Auth = Public,
                Layout = AdminLayout
              },
              index
            ) => {
              const Element = (props) => {
                return (
                  <Auth>
                    <Layout {...props}>
                      <ToastContainer />
                      {redirect && <Navigate repalce to={redirect} />}
                      {!redirect && <Component {...props} />}
                    </Layout>
                  </Auth>
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
      </Router>
    </GlobalProvider>
  );
}
