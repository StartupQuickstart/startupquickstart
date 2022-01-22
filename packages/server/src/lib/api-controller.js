import http from 'http';
import models from '@/api/models';
import Sequelize from 'sequelize';

export default class ApiController {
  constructor(model) {
    this.model = model;

    this.count = this.count.bind(this);
    this.describe = this.describe.bind(this);
    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
    this.read = this.read.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
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
      'TIMESTAMP WITH TIME ZONE': { type: 'DATE' },
      BOOLEAN: { type: 'BOOLEAN' }
    };
  }

  /**
   * Gets a count of records
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http response to send
   */
  async count(req, res, next) {
    try {
      const totalRecords = await this.model.count({
        where: req.query.filter ? req.query.filter : {},
        order: req.query.order ? req.query.order : []
      });

      return res.status(200).send({ totalRecords });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Gets a list of records
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http response to send
   */
  async index(req, res, next, options = {}) {
    options = Object.assign(
      {
        include: [
          {
            model: models.User,
            as: 'updated_by',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: models.User,
            as: 'created_by',
            attributes: ['id', 'first_name', 'last_name']
          },
          ...(this.includes || []).filter(
            (include) => !['created_by', 'updated_by'].includes(include)
          )
        ],
        attributes: null
      },
      options
    );

    const where = [req.query.filter ? req.query.filter : {}];

    if (req.query.s) {
      const searchable = Object.values(this.model.rawAttributes)
        .filter((attribute) => attribute.searchable)
        .map((attribute) => `"${this.model.name}"."${attribute.fieldName}"`);

      if (searchable.length) {
        const escaped = this.model.sequelize.escape(
          `%${req.query.s.split(' ').join('%')}%`
        );
        where.push(
          Sequelize.literal(`CONCAT(${searchable.join(',')}) ilike ${escaped}`)
        );
      }
    }

    try {
      const result = await this.model.findAndCountAll({
        offset: req.query.offset || 0,
        limit: req.query.limit || 10,
        where,
        order: req.query.order ? req.query.order : [['created_at', 'desc']],
        include: options.include,
        attributes: options.attributes
      });

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
   * @param {HttpResponst} res Http response to send
   */
  async create(req, res, next) {
    const transaction = await this.model.sequelize.transaction();

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
        const idKey = association.as + '_ids';
        const func = 'add' + as[0].toUpperCase() + as.slice(1);

        if (req.body[idKey]) {
          await record[func](req.body[idKey], { transaction });
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
   * Describes a record type
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http response to send
   */
  async describe(req, res, next) {
    try {
      const meta = {
        columns: []
      };

      function getLabel(name) {
        return name
          .split('_')
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(' ');
      }

      for (const attribute of Object.values(this.model.rawAttributes)) {
        const type = this.typeMap[attribute.type.toString()];

        meta.columns.push({
          name: attribute.fieldName,
          label: attribute.label || getLabel(attribute.fieldName),
          type,
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
   * @param {HttpResponst} res Http response to send
   */
  async read(req, res, next, options = {}) {
    try {
      options = Object.assign(
        {
          include: [
            {
              model: models.User,
              as: 'updated_by',
              attributes: ['id', 'first_name', 'last_name']
            },
            {
              model: models.User,
              as: 'created_by',
              attributes: ['id', 'first_name', 'last_name']
            },
            ...(this.includes || []).filter(
              (include) => !['created_by', 'updated_by'].includes(include)
            )
          ],
          attributes: null
        },
        options
      );

      const query = Object.assign(req.query.filter, { id: req.params.id });

      const record = await this.model.findOne({
        where: query,
        nest: true,
        include: options.include,
        attributes: options.attributes
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
   * Gets the related association
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http response to send
   */
  async related(req, res, next) {
    try {
      const name = req.params.related;
      const association = this.model.associations[name];

      if (!association) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const query = Object.assign(req.query.filter, { id: req.params.id });

      const record = await this.model.findOne({
        attributes: [],
        where: query,
        nest: true,
        include: [name]
      });

      if (!record) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      if (Array.isArray(record[name])) {
        return res
          .status(200)
          .send({ records: record[name], totalRecords: record[name].length });
      }

      return res.status(200).send(record[name]);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Updates a record
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http response to send
   */
  async update(req, res, next) {
    const transaction = await this.model.sequelize.transaction();

    try {
      const record = await this.model.findOne({
        where: { id: req.params.id },
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
        const idKey = association.as + '_ids';
        const func = 'set' + as[0].toUpperCase() + as.slice(1);

        if (req.body[idKey]) {
          await record[func](req.body[idKey], { transaction });
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
   * @param {HttpResponst} res Http response to send
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
