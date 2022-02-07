import ApiController from '@/lib/api-controller';
import models from '@/api/models';

class AccountController extends ApiController {
  constructor() {
    super(models.Account);
    this.readMe = this.readMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
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
        where: { id: req.user.account_id },
        nest: true,
        raw: true
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
    req.params.id = req.user.account_id;

    return this.update(req, res, next);
  }
}

export default new AccountController();
