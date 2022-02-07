import _ from 'lodash';
import http from 'http';
import models from '@/api/models';
import Sequelize from 'sequelize';
import { plural } from 'pluralize';

export class ApiController {
  constructor(model) {
    this.model = model;

    this.count = this.count.bind(this);
    this.describe = this.describe.bind(this);
    this.getIncludes = this.getIncludes.bind(this);
    this.getQueryOptions = this.getQueryOptions.bind(this);
    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
    this._create = this._create.bind(this);
    this.read = this.read.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.addRelated = this.addRelated.bind(this);
    this.removeRelated = this.removeRelated.bind(this);
    this.related = this.related.bind(this);
    this.getMissingFields = this.getMissingFields.bind(this);
    this.systemAttributes = [
      'id',
      'created_at',
      'updated_at',
      'created_by',
      'updated_by'
    ];
    this.typeMap = {
      UUID: { type: 'UUID' },
      'VARCHAR(255)': { type: 'TEXT', limit: 255 },
      TEXT: { type: 'TEXT' },
      'TIMESTAMP WITH TIME ZONE': { type: 'DATETIME' },
      BOOLEAN: { type: 'BOOLEAN' }
    };
  }

  /**
   * Gets a count of records
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async count(req, res, next) {
    try {
      const totalRecords = await this.model.count({
        where: req.query.filter || {},
        order: req.query.order || []
      });

      return res.status(200).send({ totalRecords });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Gets the includes for the query options
   */
  getIncludes() {
    const includes = [
      {
        model: models.User,
        as: 'updated_by',
        attributes: ['id', 'first_name', 'last_name']
      },
      {
        model: models.User,
        as: 'created_by',
        attributes: ['id', 'first_name', 'last_name']
      }
    ];

    for (const association of Object.values(this.model.associations)) {
      if (association.options.autoInclude) {
        includes.push(association.as);
      }
    }

    return includes;
  }

  /**
   * Gets a list of records
   *
   * @param {HttpRequest} req Http request to handle
   * @param {Object} options Default options to use
   */
  getQueryOptions(req, options = {}) {
    options = Object.assign(
      {
        include: this.getIncludes(),
        attributes: null
      },
      options
    );

    const where = [req.query.filter || {}];

    const search = req.query.s || req.query.search;

    if (search) {
      const searchable = Object.values(this.model.rawAttributes)
        .filter((attribute) => attribute.searchable)
        .map((attribute) => `"${this.model.name}"."${attribute.fieldName}"`);

      if (searchable.length) {
        const escaped = this.model.sequelize.escape(
          `%${search.split(' ').join('%')}%`
        );
        where.push(
          Sequelize.literal(`CONCAT(${searchable.join(',')}) ilike ${escaped}`)
        );
      }
    }

    const queryOptions = {
      offset: req.query.offset || 0,
      limit: req.query.limit || 10,
      where,
      order: req.query.order || [['created_at', 'desc']],
      include: options.include,
      attributes: options.attributes
    };

    return queryOptions;
  }

  /**
   * Gets a list of records
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async index(req, res, next, options = {}) {
    try {
      const queryOptions = this.getQueryOptions(req, options);
      const result = await this.model.findAndCountAll(queryOptions);

      return res
        .status(200)
        .send({ records: result.rows, totalRecords: result.count });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Creates a record
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async _create(req, res, outsideTransaction) {
    const transaction =
      outsideTransaction || (await this.model.sequelize.transaction());

    try {
      const data = req.body;

      if (this.model.rawAttributes.account_id) {
        data.account_id = req.user.account_id;
      }

      data.created_by_id = req.user.id;
      data.updated_by_id = req.user.id;

      const record = await this.model.create(data, { transaction });

      for (const as in this.model.associations) {
        const association = this.model.associations[as];

        const singleIdKey = association.as + '_ids';
        const manyIdsKey = association.as + '_ids';
        const value = req.body[singleIdKey || manyIdsKey];

        const func = 'set' + _.capitalize(as);

        if (value) {
          await record[func](value, { transaction });
        }
      }

      !outsideTransaction && (await transaction.commit());
      return record;
    } catch (err) {
      !outsideTransaction && (await transaction.rollback());
      throw err;
    }
  }

  /**
   * Creates a record and returns the response
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async create(req, res, next) {
    try {
      const record = await this._create(req, res, next);
      return res.status(200).send(record);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Describes a record type
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async describe(req, res, next) {
    try {
      const meta = {
        columns: []
      };

      function getLabel(name) {
        let label = name
          .split('_')
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(' ');

        if (label.endsWith(' Id')) {
          label = label.slice(0, label.length - 3);
        }

        if (label.endsWith(' Datetime')) {
          label = label.slice(0, label.length - 8) + 'Date';
        }

        return label;
      }

      for (const attribute of Object.values(this.model.rawAttributes)) {
        let type = 'STRING';

        const rawType = attribute.type.toString();
        if (this.typeMap[rawType]) {
          type = this.typeMap[rawType];
        } else {
          console.log(`Type ${rawType} needs to be mapped.`);
        }

        const association = _.find(
          Object.values(this.model.associations),
          (association) => {
            return association.sourceKey === attribute.fieldName;
          }
        );

        if (association) {
          type.related = association.target.tableName;
          type.relatedPath = association.target.tableName.replace(/_/g, '-');
        }

        meta.columns.push({
          name: attribute.fieldName,
          label: attribute.label || getLabel(attribute.fieldName),
          type: _.cloneDeep(type),
          required: attribute.allowNull === false,
          canCreate: attribute.canCreate === true,
          canUpdate: attribute.canUpdate === true
        });
      }

      return res.status(200).send(meta);
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
  async read(req, res, next, options = {}) {
    try {
      const queryOptions = this.getQueryOptions(req, options);

      const record = await this.model.findOne(queryOptions);

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      return res.status(200).send(record);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Creates a related association
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async addRelated(req, res, next) {
    const transaction = await this.model.sequelize.transaction();

    try {
      const name = req.params.related?.replace(/-/g, '_');
      const association = this.model.associations[name];

      if (!association) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const query = Object.assign(req.query.filter, { id: req.params.id });
      const record = await this.model.findOne({ where: query });

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      let id = req.body.id;

      const transaction = await this.model.sequelize.transaction();

      if (!id) {
        const controller = new ApiController(association.target);
        const related = await controller._create(req, res, transaction);
        id = related.id;
      }

      const funcName = 'add' + _.capitalize(name);
      await record[funcName](id, { transaction });

      await transaction.commit();
      return res.status(200).send(record);
    } catch (err) {
      transaction.rollback();
      return next(err);
    }
  }

  /**
   * Gets the related association
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async related(req, res, next) {
    try {
      const name = req.params.related?.replace(/-/g, '_');
      const association = this.model.associations[name];

      if (!association) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const recordQuery = { id: req.params.id };

      if (this.model.rawAttributes.account_id) {
        recordQuery.account_id = req.user.account_id;
      }

      const record = await this.model.findOne({ where: recordQuery });

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const controller = new ApiController(association.target);
      const getFuncName = 'get' + _.capitalize(name);
      const countFuncName = 'count' + _.capitalize(name);
      const queryOptions = controller.getQueryOptions(req);

      if (['hasOne', 'belongsTo'].includes(association.associationType)) {
        const record = record[getFuncName](queryOptions);
        return res.status(200).send(record);
      } else {
        const [records, totalRecords] = await Promise.all([
          record[getFuncName](queryOptions),
          record[countFuncName]({
            where: queryOptions.where,
            inlcudes: queryOptions.includes
          })
        ]);
        return res.status(200).send({ records, totalRecords });
      }
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Removes a related association
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async removeRelated(req, res, next) {
    const transaction = await this.model.sequelize.transaction();

    try {
      const name = req.params.related?.replace(/-/g, '_');
      const association = this.model.associations[name];

      if (!association) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const query = Object.assign(req.query.filter, { id: req.params.id });
      const record = await this.model.findOne({ where: query });

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const funcName = 'remove' + _.capitalize(name);
      await record[funcName](req.params.relatedId, { transaction });

      await transaction.commit();
      return res.status(200).send(record);
    } catch (err) {
      transaction.rollback();
      return next(err);
    }
  }

  /**
   * Updates a record
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async update(req, res, next) {
    const transaction = await this.model.sequelize.transaction();

    const query = Object.assign(req.query.filter, { id: req.params.id });

    try {
      const record = await this.model.findOne({
        where: query,
        nest: true
      });

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const restricted = [...this.systemAttributes, 'account'];

      for (const key in req.body) {
        if (!restricted.includes(key)) {
          record[key] = req.body[key];
        }
      }

      record.updated_by = req.user.id;

      await record.save({ transaction });

      for (const as in this.model.associations) {
        const association = this.model.associations[as];

        const singleIdKey = association.as + '_ids';
        const manyIdsKey = association.as + '_ids';
        const value = req.body[singleIdKey || manyIdsKey];

        const func = 'set' + _.capitalize(as);

        if (value) {
          await record[func](value, { transaction });
        }
      }

      await transaction.commit();

      return res.status(200).send(record);
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
  }

  /**
   * Deletes a record
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async delete(req, res, next) {
    try {
      const query = Object.assign(req.query.filter, { id: req.params.id });

      const record = await this.model.findOne({ where: query, nest: true });

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      await record.destroy();

      return res.status(204).send(http.STATUS_CODES[204]);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Gets the missing fields from the data
   *
   * @param {Object} data Data to get missing fields for
   */
  getMissingFields(data) {
    const missingFields = [];
    const keys = Object.keys(data.toObject ? data.toObject() : data).filter(
      (key) =>
        data[key] !== undefined &&
        data[key] !== null &&
        data[key] &&
        (!data[key].trim || data[key].trim() !== '')
    );
    const attributes = this.model.rawAttributes;

    for (const name in attributes) {
      const attribute = attributes[name];

      if (
        !this.systemAttributes.includes(attribute.field) &&
        attribute.allowNull === false &&
        !keys.includes(attribute.field)
      ) {
        missingFields.push(attribute.field);
      }
    }

    return missingFields;
  }
}

export default ApiController;
