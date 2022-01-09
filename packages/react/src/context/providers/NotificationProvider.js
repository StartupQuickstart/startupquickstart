import React, { useState, useContext } from 'react';

const NotificationContext = React.createContext({});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const data = {
    notifications,
    setNotifications
  };

  return (
    <NotificationContext.Provider value={data}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification can only be used inside NotificationProvider'
    );
  }
  return context;
};
