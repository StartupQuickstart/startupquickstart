import http from 'http';
import ApiController from '@/lib/api-controller';
import models from '@/api/models';
import Core from '@/lib/core';
import { Op } from 'sequelize';

class SystemSettingController extends ApiController {
  constructor() {
    super(models.SystemSetting);

    this.getFeatures = this.getFeatures.bind(this);
    this.enableFeature = this.enableFeature.bind(this);
  }

  /**
   * Gets the features for the app
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async getFeatures(req, res, next) {
    try {
      const result = await this.model.findAndCountAll({
        where: { type: 'feature', name: { [Op.in]: Core.featureNames } }
      });

      const records = result.rows.map((feature) => feature.value);

      return res.status(200).send({ records, totalRecords: result.count });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Toggles a feature on or off
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async enableFeature(req, res, next) {
    try {
      const feature = await this.model.findOne({
        where: { type: 'feature', name: req.params.name }
      });

      if (!feature) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      feature.value = { ...feature.value, enabled: req.body.enabled };

      await feature.save();

      return res.status(200).send(http.STATUS_CODES[200]);
    } catch (err) {
      return next(err);
    }
  }
}

export default new SystemSettingController();
