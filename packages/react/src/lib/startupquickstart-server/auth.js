import axios from 'axios';
import Cookies from 'js-cookie';

export class Auth {
  constructor(version = 'v1') {
    this.apiTokenCookie = 'api-token';

    let adapter = axios.defaults.adapter;
    const config = {
      baseURL: `/api/${version}/auth/`
    };

    config.adapter = this.axiosAdapter(adapter);
    this.api = axios.create(config);
  }

  /**
   * Authenticates the user
   */
  async authenticate(email, password) {
    const { data } = await this.api.post('authorize', { email, password });
    return data?.token;
  }

  /**
   * Activates the users account
   *
   * @param {String} activationCode Code to use to activate account
   */
  async activateAccount(activationCode) {
    const result = await this.api.post('activate', { activationCode });
    return result.data;
  }

  /**
   * Adapter to add auth to axios
   *
   * @param {Object} axiosAdapter AxiosAdapter
   */
  axiosAdapter = (axiosAdapter) => {
    return async (config) => {
      const token = this.getToken();

      if (token && !config.headers.authorization) {
        config.headers.authorization = `bearer ${token}`;
      }

      config.headers['Content-Type'] = 'application/json';
      config.headers.Accept = 'application/json';

      return axiosAdapter(config);
    };
  };

  /**
   * Gets the id token
   */
  getToken() {
    return Cookies.get(this.apiTokenCookie);
  }

  /**
   * Refreshes the users access token
   */
  async refreshToken() {
    const { data } = await this.api.post('refresh');
    return data?.token;
  }

  /**
   * Sends the user an activation email
   */
  async sendActivationEmail() {
    const result = await this.api.post('send-activation-email');
    return result.data;
  }

  /**
   * Sets a reset password link
   *
   * @param {String} email Email to send password reset link to
   */
  async sendResetPasswordLink(email) {
    const result = await this.api.post('forgot-password', { email });
    return result.data;
  }

  /**
   * Resets the password with a reset token
   *
   * @param {String} password Password to set
   * @param {String} token Token to use to set password
   */
  async resetPassword(password, token) {
    const { data } = await this.api.post(
      'reset-password',
      { password },
      { headers: { authorization: `bearer ${token}` } }
    );
    return data?.token;
  }

  /**
   * Signs up the user
   *
   * @param {Object} data Data used for signup
   */
  async signup(user) {
    const { data } = await this.api.post('signup', user);
    return data?.token;
  }
}

export default new Auth('v1');
