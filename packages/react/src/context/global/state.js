export const state = {
  features: { messages: true, notifications: true },
  messages: [],
  notifications: [],
  sidebarCollapsed: false,
  sidebarItems: [
    {
      name: '',
      items: [
        { name: 'Dashboard', to: '/', icon: 'BarChart2' },
        {
          name: 'Settings',
          to: '/settings',
          icon: 'Settings',
          items: [
            { name: 'General', to: '/settings/general', icon: 'ArrowRight' },
            { name: 'Core', to: '/settings/core', icon: 'ArrowRight' }
          ]
        },
        {
          name: 'Logut',
          to: '/logout',
          icon: 'LogOut',
          className: 'd-block d-md-none'
        }
      ]
    }
  ],
  user: { name: 'Thomas Boles', first_name: 'Thomas', last_name: 'Boles' },
  userOptions: [
    {
      name: 'Logut',
      to: '/logout',
      icon: 'LogOut'
    }
  ],
  sidebarCallToAction: {
    title: 'Documentation',
    description: 'View source code and docs on github to get started.',
    actionTitle: 'View on Github',
    actionTo: 'https://github.com/StartupQuickstart/startupquickstart'
  },
  info: {
    website: 'https://github.com/StartupQuickstart/startupquickstart',
    legalName: 'SuggestEdit, LLC',
    supportPage:
      'https://github.com/StartupQuickstart/startupquickstart/issues',
    privacyPolicy: 'https://app.startupquickstart.com/privacy-policy',
    termsOfService: 'https://app.startupquickstart.com/privacy-policy'
  }
};

export default state;
