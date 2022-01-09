import React, { useState, useContext } from 'react';

const ConfigContext = React.createContext({});

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    website: 'https://github.com/StartupQuickstart/startupquickstart',
    legalName: 'SuggestEdit, LLC',
    supportPage:
      'https://github.com/StartupQuickstart/startupquickstart/issues',
    privacyPolicy: 'https://app.startupquickstart.com/privacy-policy',
    termsOfService: 'https://app.startupquickstart.com/privacy-policy',
    supportEmail: 'support@startupquickstart.com',
    signup: {
      // heading: 'Register your 30-day unlimited-use free trial',
      // subheading: 'Start crowd sourcing your readers as proofreaders today.',
      optionalFields: ['first_name', 'last_name', 'company_name']
    }
  });

  const [features, setFeatures] = useState({
    messages: false,
    notifications: false
  });

  const data = {
    config,
    setConfig,
    features,
    setFeatures
  };

  return (
    <ConfigContext.Provider value={data}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig can only be used inside ConfigProvider');
  }
  return context;
};
