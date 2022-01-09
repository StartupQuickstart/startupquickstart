import React, { useState, useContext } from 'react';

const SetupContext = React.createContext({});

export const SetupProvider = ({ children }) => {
  const [setupItems, setSetupItems] = useState([
    { name: 'signup', label: 'Sign up' },
    { name: 'activate', label: 'Activate account' }
  ]);

  const data = {
    setupItems,
    setSetupItems
  };

  return <SetupContext.Provider value={data}>{children}</SetupContext.Provider>;
};

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetup can only be used inside SetupProvider');
  }
  return context;
};
