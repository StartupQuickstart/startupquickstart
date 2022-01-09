import React, { useState, useContext } from 'react';

const NavigationContext = React.createContext({});

export const NavigationProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([
    {
      name: '',
      items: [
        { name: 'Dashboard', to: '/', icon: 'BarChart2' },
        // {
        //   name: 'Settings',
        //   to: '/settings',
        //   icon: 'Settings',
        //   items: [
        //     { name: 'General', to: '/settings/general', icon: 'ArrowRight' },
        //     { name: 'Core', to: '/settings/core', icon: 'ArrowRight' }
        //   ]
        // },
        {
          name: 'Logut',
          to: '/logout',
          icon: 'LogOut',
          className: 'd-block d-md-none'
        }
      ]
    }
  ]);

  const [callToAction, setCallToAction] = useState({
    title: 'Documentation',
    description: 'View source code and docs on github to get started.',
    actionTitle: 'View on Github',
    actionTo: 'https://github.com/StartupQuickstart/startupquickstart'
  });

  const [userOptions, setUserOptions] = useState([
    {
      name: 'Logut',
      to: '/logout',
      icon: 'LogOut'
    }
  ]);

  /**
   * Toggles sidebar items
   *
   * @param {Number} groupIndex Index of the sidebar group
   * @param {Number} itemIndex Index of the item in the group
   */
  function toggleSidebarItem(groupIndex, itemIndex) {
    const newSidebarItems = JSON.parse(JSON.stringify(sidebarItems));
    const item = newSidebarItems[groupIndex].items[itemIndex];

    if (item.collapsed === undefined || item.collapsed === true) {
      item.collapsed = false;
    } else {
      item.collapsed = true;
    }

    return setSidebarItems(newSidebarItems);
  }

  /**
   * Toggles the sidebar to collapsed and open
   */
  function toggleSidebar() {
    setSidebarCollapsed(!sidebarCollapsed);
  }

  const data = {
    sidebarCollapsed,
    sidebarItems,
    setSidebarItems,
    userOptions,
    setUserOptions,
    toggleSidebarItem,
    toggleSidebar,
    callToAction,
    setCallToAction
  };

  return (
    <NavigationContext.Provider value={data}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation can only be used inside NavigationProvider');
  }
  return context;
};
