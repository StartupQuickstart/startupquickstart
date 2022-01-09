import React, { useState, useContext } from 'react';

const MessageContext = React.createContext({});

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const data = {
    messages,
    setMessages
  };

  return (
    <MessageContext.Provider value={data}>{children}</MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage can only be used inside MessageProvider');
  }
  return context;
};
