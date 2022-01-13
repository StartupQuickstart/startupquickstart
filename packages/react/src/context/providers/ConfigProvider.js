import React, { useState, useContext } from 'react';

const ConfigContext = React.createContext({});

export const ConfigProvider = ({ children, ...props }) => {
  const [config, setConfig] = useState(
    props.config || {
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
      },
      logo: {
        src: require('../../assets/images/logo.png'),
        alt: 'StartupQuickstart'
      }
    }
  );

  const [callToAction, setCallToAction] = useState(
    props.callToAction || {}
    // {
    //   title: 'Documentation',
    //   description: 'View source code and docs on github to get started.',
    //   actionTitle: 'View on Github',
    //   actionTo: 'https://github.com/StartupQuickstart/startupquickstart'
    // }
  );

  const [features, setFeatures] = useState(
    props.features || {
      messages: false,
      notifications: false
    }
  );

  const data = {
    config,
    setConfig,
    features,
    setFeatures,
    callToAction,
    setCallToAction
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
