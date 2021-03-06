import http from 'http';
import ApiController from '@/lib/api-controller';
import models from '@/api/models';

class UserController extends ApiController {
  constructor() {
    super(models.User);
    this.inviteUser = this.inviteUser.bind(this);
    this.readMe = this.readMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
  }

  /**
   * Sends the user an invite email
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async inviteUser(req, res, next) {
    try {
      const user = await this.model.findOne({
        where: { id: req.params.id },
        nest: true,
        include: ['account']
      });

      if (!user) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      await this.model.inviteUser(user);

      return res.status(200).send(http.STATUS_CODES[200]);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Reads a record
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async readMe(req, res, next) {
    try {
      const record = await this.model.findOne({
        where: { id: req.user.id },
        nest: true,
        raw: true,
        include: ['account']
      });

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      return res.status(200).send(record);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Updates a record
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async updateMe(req, res, next) {
    req.params.id = req.user.id;
    const user = req.user;

    if (user.account.name === (user.first_name + ' ' + user.last_name).trim()) {
      const firstName = req.body.first_name || req.user.first_name;
      const lastName = req.body.last_name || req.user.last_name;

      req.user.account.account_name = (firstName + ' ' + lastName).trim();
    }

    return this.update(req, res, next);
  }
}

export default new UserController();
