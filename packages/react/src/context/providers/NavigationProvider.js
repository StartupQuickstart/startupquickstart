import React, { useState, useContext } from 'react';

const NavigationContext = React.createContext({});

export const NavigationProvider = ({ children, ...props }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState(
    props.sidebarItems || [
      {
        name: '',
        items: [
          { name: 'Dashboard', to: '/', icon: 'BarChart2' },
          { name: 'Inputs', to: '/inputs', icon: 'List' },
          { name: 'Records', to: '/records', icon: 'Folder' }
        ]
      },
      {
        name: 'Admin',
        canView: (user) => user?.hasRole(['admin', 'super_admin']),
        items: [
          {
            name: 'Admin Only',
            to: '/admin/require-role',
            icon: 'Lock',
            canView: (user) => user?.hasRole(['admin', 'super_admin'])
          },
          { name: 'Users', to: '/admin/users', icon: 'Users' }
        ]
      },
      {
        name: 'Security',
        items: [
          {
            name: 'OAuth2 Clients',
            to: '/admin/oauth2-clients',
            icon: 'Box',
            canView: (user) => user?.hasRole(['admin', 'super_admin'])
          }
        ]
      }
    ]
  );

  const [userOptions, setUserOptions] = useState([
    {
      name: 'Logout',
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
    toggleSidebar
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
