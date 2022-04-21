import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class OAuth2Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.OAuth2Token.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'user_id',
        as: 'user'
      });
      models.OAuth2Token.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'created_by_id',
        as: 'created_by'
      });
      models.OAuth2Token.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'updated_by_id',
        as: 'updated_by'
      });
    }
  }

  OAuth2Token.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      token: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      token_type: {
        allowNull: false,
        type: DataTypes.TEXT,
        enum: ['revoked_token', 'authorization_code']
      },
      scope: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      expires_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      client_id: {
        allowNull: false,
        type: DataTypes.TEXT
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
      modelName: 'OAuth2Token',
      schema: 'app',
      tableName: 'oauth2_tokens',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return OAuth2Token;
};
