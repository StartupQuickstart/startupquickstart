import Cookies from 'js-cookie';

export class Auth {
  /**
   * Authenticates the user
   */
  static async authenticate(email, password) {
    // Authenticate with server here
    // Return jwt token
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRob21hcyBCb2xlcyIsImlhdCI6MTUxNjIzOTAyMn0.DW-lcvW7V_UBhSZOcau3qdJ0AswVZPnieuB4CEk21Bs';
    return token;
  }

  /**
   * Activates the users account
   *
   * @param {String} activationCode Code to use to activate account
   */
  static async activateAccount(activationCode) {
    return true;
  }

  /**
   * Adapter to add auth to axios
   *
   * @param {Object} axiosAdapter AxiosAdapter
   */
  static axiosAdapter = (axiosAdapter) => {
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
  static getToken() {
    return Cookies.get('api-token');
  }

  static onSetUser(user) {
    if (user) {
      user.name = `${user.firstName} ${user.lastName}`;
    }

    return user;
  }

  /**
   * Refreshes the users access token
   */
  async refreshToken() {
    // Return jwt token
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRob21hcyBCb2xlcyIsImlhdCI6MTUxNjIzOTAyMn0.DW-lcvW7V_UBhSZOcau3qdJ0AswVZPnieuB4CEk21Bs';
    return token;
  }

  /**
   * Sends the user an activation email
   */
  async sendActivationEmail() {
    console.log('Sending activation email...');
    return true;
  }

  /**
   * Sets a reset password link
   *
   * @param {String} email Email to send password reset link to
   */
  async sendResetPasswordLink(email) {
    console.log('Sending reset password link...');
    return true;
  }

  /**
   * Resets the password with a reset token
   *
   * @param {String} password Password to set
   * @param {String} token Token to use to set password
   */
  async resetPassword(password, token) {
    console.log('Resets password...');
    return true;
  }

  /**
   * Signs up the user
   *
   * @param {Object} data Data used for signup
   */
  signup = async (data) => {
    console.log('Signing user up...');
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRob21hcyBCb2xlcyIsImlhdCI6MTUxNjIzOTAyMn0.DW-lcvW7V_UBhSZOcau3qdJ0AswVZPnieuB4CEk21Bs';
    return token;
  };
}

export default Auth;
