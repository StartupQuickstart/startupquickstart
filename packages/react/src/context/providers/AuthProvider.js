import React, { useState, useContext } from 'react';

const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * Authenticates a user
   *
   * @param {String} email Email Address to use for authentication
   * @param {String} password Password to use for authentication
   */
  function authenticate(email, password) {
    setUser({
      email,
      name: 'Thomas Boles',
      first_name: 'Thomas',
      last_name: 'Boles'
    });
    setAuthenticated(true);
  }

  /**
   * Logs the user out
   */
  function logout(redirectTo = '/login') {
    setAuthenticated(false);
    setUser(false);
  }

  function sendActivationLink(email) {
    console.log('Sending activation email to', email);
  }

  function sendResetPasswordLink(email) {
    console.log('Sending reset passworkd link to', email);
  }

  const data = {
    isAuthenticated,
    setAuthenticated,
    user,
    authenticate,
    logout,
    sendActivationLink,
    sendResetPasswordLink
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth can only be used inside AuthProvider');
  }
  return context;
};
