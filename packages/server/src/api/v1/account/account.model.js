import { Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import models from '@/api/models';

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Account.hasMany(models.User, {
        foreignKey: 'account_id',
        sourceKey: 'id',
        as: 'accounts'
      });
      models.Account.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'created_by_id',
        as: 'created_by'
      });
      models.Account.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'updated_by_id',
        as: 'updated_by'
      });
    }

    /**
     * Gets the account for the user
     *
     * @param {String} userId Id of the user to get the account for
     */
    static async getAccountForUser(userId) {
      const user = await models.User.findOne({
        where: { id: userId },
        include: ['account'],
        nest: true,
        raw: true
      });

      return user.account;
    }
  }

  Account.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.TEXT
      },
      website: {
        type: DataTypes.STRING
      },
      is_setup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      stripe_customer_id: {
        type: DataTypes.STRING,
        unique: true
      },
      hubspot_company_id: {
        type: DataTypes.STRING,
        unique: true
      },
      created_by_id: {
        type: DataTypes.UUID
      },
      updated_by_id: {
        type: DataTypes.UUID
      }
    },
    {
      sequelize,
      modelName: 'Account',
      schema: 'app',
      tableName: 'accounts',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Account.beforeValidate((account) => {
    account.icon_id = account.icon_id || uuidv4();
  });

  return Account;
};
