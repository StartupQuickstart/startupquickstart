import React, { useContext } from 'react';
import ApiDemo from 'lib/demo/api';

const ApiContext = React.createContext({});

export const ApiProvider = ({ children, Api = ApiDemo, Auth }) => {
  if (Api && Auth) {
    Api.setAuth(Auth);
  }

  const data = {
    Api
  };

  return <ApiContext.Provider value={data}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi can only be used inside ApiProvider');
  }
  return context;
};
