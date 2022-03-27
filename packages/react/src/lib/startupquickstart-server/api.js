import User from './user';
import ApiRoute from './api-route';

export class Api {
  static Auth;
  static routes = {};
  static constructors = {
    users: User
  };

  /**
   * Gets an api route
   *
   * @param {String} route Route prefix to get
   */
  static get = (route, version = 'v1') => {
    const ApiRouteC = this.constructors[route] || ApiRoute;

    Api.routes[route] =
      Api.routes[route] || new ApiRouteC(route, Api.Auth, { version });
    return Api.routes[route];
  };

  /**
   * Registers a new api route
   * @param {String} route Route prefix to register
   * @param {Class} constructor Constructor to use for the route
   */
  static register(route, constructor) {
    this.constructors[route] = constructor;
  }

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
