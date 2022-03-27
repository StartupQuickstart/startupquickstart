import ApiRoute from './api-route';
import Toast from '@/lib/toast';

export class User extends ApiRoute {
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

  /**
   * Sends an invite email to the user
   *
   * @param {Object} user User to send invite
   */
  async sendInviteEmail(user) {
    const promise = this.axios.get(user.id + '/send-invite-email');
    Toast.promise(promise, {
      pending: `Sending invite to ${user.name}`,
      success: `Sent invite to ${user.name}`,
      error: `Failed to send invite to ${user.name}`
    });
  }
}

export default User;
