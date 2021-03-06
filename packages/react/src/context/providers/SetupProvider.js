import _ from 'lodash';
import React, { useState, useContext } from 'react';

const SetupContext = React.createContext({});

export const SetupProvider = ({ children, ...props }) => {
  const defaultItems = [{ name: 'signup', label: 'Sign up' }];

  if (props.requireActivation !== false) {
    defaultItems.push({ name: 'activate', label: 'Activate account' });
  }

  const [setupItems, setSetupItems] = useState(defaultItems);

  /**
   * Checks to see if the setup item exists
   *
   * @param {String} name Name of setup item
   * @returns {Boolean} Whether or not the setup item exists
   */
  function hasSetupItem(name) {
    return !!_.find(setupItems, (item) => item.name === name);
  }

  const data = {
    setupItems,
    setSetupItems,
    hasSetupItem
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
