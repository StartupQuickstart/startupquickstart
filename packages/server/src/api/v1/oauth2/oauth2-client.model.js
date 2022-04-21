import crypto from 'crypto';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class OAuth2Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.OAuth2Client.hasOne(models.Account, {
        foreignKey: 'id',
        sourceKey: 'account_id',
        as: 'account'
      });
      models.OAuth2Client.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'created_by_id',
        as: 'created_by'
      });
      models.OAuth2Client.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'updated_by_id',
        as: 'updated_by'
      });
    }

    static generateClientSecret() {
      return crypto.randomBytes(32).toString('hex');
    }
  }

  OAuth2Client.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      account_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        allowNull: false,
        type: DataTypes.TEXT,
        canCreate: true,
        canUpdate: true
      },
      client_secret: {
        allowNull: false,
        type: DataTypes.TEXT,
        defaultValue: OAuth2Client.generateClientSecret
      },
      private_key: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      public_key: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      redirect_uris: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.TEXT),
        canCreate: true,
        canUpdate: true
      },
      grants: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.TEXT),
        canCreate: true,
        canUpdate: true,
        enum: ['authorization_code', 'refresh_token', 'client_credentials'],
        defaultValue: [
          'authorization_code',
          'refresh_token',
          'client_credentials'
        ]
      },
      scope: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.TEXT),
        canCreate: true,
        canUpdate: true,
        enum: ['read:basic', 'write:basic', 'read:admin', 'write:admin'],
        defaultValue: ['read:basic', 'write:basic']
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
      modelName: 'OAuth2Client',
      schema: 'app',
      tableName: 'oauth2_clients',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['private_key', 'public_key'] }
      }
    }
  );

  OAuth2Client.beforeCreate(async (client, options) => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 1024,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    client.private_key = privateKey.toString('base64');
    client.public_key = publicKey.toString('base64');
  });

  return OAuth2Client;
};
