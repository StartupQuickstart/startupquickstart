import ApiRoute from './api-route';

export class Api {
  static Auth;
  static routes = {};

  /**
   * Gets an api route
   *
   * @param {String} route Route prefix to get
   */
  static get = (route, version = 'v1') => {
    Api.routes[route] =
      Api.routes[route] || new ApiRoute(route, Api.Auth, { version });
    return Api.routes[route];
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
