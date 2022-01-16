import Cookies from 'js-cookie';
import React, { useState, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import AuthDemo from 'lib/demo/auth';

const AuthContext = React.createContext({});

export const AuthProvider = ({ children, Auth = AuthDemo }) => {
  const [isAuthenticated, setAuthenticated] = useState(null);
  const [user, _setUser] = useState(null);

  const apiTokenCookie = Auth.apiTokenCookie || 'api-token';

  /**
   * Authenticates a user
   *
   * @param {String} email Email Address to use for authentication
   * @param {String} password Password to use for authentication
   */
  async function authenticate(email, password) {
    const token = await Auth.authenticate(email, password);

    if (!token) {
      throw new Error('Failed to authenticate');
    }

    setToken(token);
  }

  /**
   * Sets a token
   *
   * @param {JWT} Token to set
   */
  function setToken(token) {
    if (!token) {
      throw new Error('Failed to set token');
    }

    Cookies.set(apiTokenCookie, token);

    const user = jwtDecode(token);
    setUser(user);

    setAuthenticated(true);
  }

  /**
   * Gets the jwt token stored in cookies
   */
  function getToken() {
    return Cookies.get(apiTokenCookie);
  }

  /**
   * Checks to see if a user is authenticated
   */
  function checkAuth() {
    const token = getToken();

    if (!token) {
      return false;
    }

    const payload = jwtDecode(token);
    const isExpired = payload.exp < Date.now() / 1000;

    if (isExpired) {
      logout();
    } else {
      const user = payload?.user || payload;
      setUser(user);
      setAuthenticated(true);
    }

    return !isExpired;
  }

  /**
   * Logs the user out
   */
  function logout(redirectTo = '/login') {
    Cookies.remove(apiTokenCookie);
    setAuthenticated(false);
    setUser(false);
  }

  /**
   * Sets the user
   *
   * @param {Object} user User to set
   */
  function setUser(user) {
    if (Auth.onSetUser) {
      user = Auth.onSetUser(user);
    }

    _setUser(user);
  }

  async function activateAccount(activationCode) {
    return await Auth.activateAccount(activationCode);
  }

  /**
   * Resets the password with a reset token
   *
   * @param {String} password Password to set
   * @param {String} resetToken Token to use to set password
   */
  async function resetPassword(password, resetToken) {
    const token = await Auth.resetPassword(password, resetToken);
    setToken(token);
  }

  async function sendActivationLink(email) {
    return await Auth.sendActivationLink(email);
  }

  async function sendResetPasswordLink(email) {
    return await Auth.sendResetPasswordLink(email);
  }

  async function signup(user) {
    const token = await Auth.signup(user);
    setToken(token);
  }

  const data = {
    checkAuth,
    isAuthenticated,
    setAuthenticated,
    user,
    authenticate,
    logout,
    sendActivationLink,
    sendResetPasswordLink,
    signup,
    activateAccount,
    resetPassword
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
