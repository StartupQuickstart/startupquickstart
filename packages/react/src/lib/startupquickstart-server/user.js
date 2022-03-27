import ApiRoute from './api-route';
import Toast from '@/lib/toast';

class UserRoute extends ApiRoute {
  constructor() {
    super('users');
  }

  /**
   * Activates a deactivated user
   *
   * @param {Object} user User to activate
   */
  async activate(user) {
    try {
      const result = await this.update(user.id, { is_deactivated: false });
      Toast.success(`Activated ${user.name}`);
      return result;
    } catch (err) {
      console.log(err);
      Toast.error();
    }
  }

  /**
   * User to deactivate
   *
   * @param {Object} user User to deactivate
   */
  async deactivate(user) {
    try {
      const result = await this.update(user.id, { is_deactivated: true });
      Toast.success(`Deactivated ${user.name}`);
      return result;
    } catch (err) {
      console.log(err);
      Toast.error();
    }
  }
}

export const User = new UserRoute();
export default User;
