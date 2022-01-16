import ApiRoute from './api-route';

export class Api {
  static Auth;
  static routes = {};

  /**
   * Gets an api route
   *
   * @param {String} route Route prefix to get
   */
  static get = (route) => {
    this.routes[route] = this.routes[route] || new ApiRoute(route, Api.Auth);
    return this.routes[route];
  };

  /**
   * Sets the auth Provider
   *
   * @param {Object} Auth AuthProvider to set
   */
  static setAuth(Auth) {
    this.Auth = Auth;
  }
}

export default Api;
