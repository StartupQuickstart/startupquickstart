import { Model } from 'sequelize';
import crypto from 'crypto';
import Hubspot from '@/lib/hubspot';
import jwt from 'jsonwebtoken';
import Mailer from '@/lib/mailer';
import randomatic from 'randomatic';
import Config from '@/config';

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Activates the user
     *
     * @param {String} activationCode Activation code to use to activate the account
     */
    async activate(activationCode) {
      const now = new Date();

      if (
        activationCode &&
        activationCode === this.activation_code &&
        this.activation_code_expiration_date > now
      ) {
        this.is_activated = true;
        this.activation_code = null;
        this.activation_code_expiration_date = null;
        await this.save();
        return true;
      }

      return false;
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsTo(models.Account, {
        sourceKey: 'account_id',
        targetKey: 'id',
        as: 'account'
      });
      models.User.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'created_by_id',
        as: 'created_by'
      });
      models.User.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'updated_by_id',
        as: 'updated_by'
      });
    }

    /**
     * Hashes the password
     *
     * @param {String} password Password to hash
     */
    static async asyncHashPassword(password) {
      return crypto.scryptSync(password, config.enc.secret, 32).toString('hex');
    }

    /**
     * Gets the users api token
     *
     * @param {Array} scope to set on token
     * @param {String} expiresIn Amount of time the token lasts
     */
    async getToken(scope = ['api'], expiresIn = '24h') {
      const token = jwt.sign(
        {
          sub: this.id,
          iss: process.env.HOST,
          aud: process.env.HOST,
          scope,
          id: this.id,
          account_id: this.account_id,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          is_activated: this.is_activated
        },
        config.enc.secret,
        { expiresIn }
      );

      return token;
    }

    /**
     * Invites a user to the account
     *
     * @param {Array} user User to invite
     */
    static async inviteUser(user) {
      if (!user.password) {
        const token = await user.getToken(['reset_password'], '24h');
        const createdBy = await user.getCreated_by();

        await Mailer.send(
          'InviteUser',
          {
            email: user.email,
            token,
            link: `${process.env.HOST}/reset-password?token=${token}`,
            config: Config,
            createdBy
          },
          {
            from: `${Config.name} <${Config.noReplyEmail}>`,
            to: user.email,
            subject:
              `${createdBy.first_name} ${createdBy.first_name}` +
              ` has invited you to join them in ${Config.name}`
          }
        );
      }
    }

    /**
     * Gets the setup progress for the user
     */
    async getSetupProgress() {
      return {
        activate: this.is_activated
      };
    }

    /**
     * Sends the user an activation email
     */
    async sendActivationEmail() {
      this.activation_code = randomatic('A0', 4);
      this.activation_code_expiration_date = new Date();
      this.activation_code_expiration_date.setHours(
        this.activation_code_expiration_date.getHours() + 4
      );

      await this.save();

      await Mailer.send(
        'UserActivationEmail',
        { user: this },
        {
          from: `${Config.name} <${Config.noReplyEmail}>`,
          to: this.email,
          subject: `${Config.name} account activation code`
        }
      );
    }

    /**
     * Sends the user a reset password link
     *
     * @param {String} email to to send reset password link to
     */
    static async sendResetPasswordLink(email) {
      const user = await this.findOne({ where: { email } });

      if (!user) {
        throw new Error(`Could not find user with email: ${email}`);
      }

      const token = await user.getToken(['reset_password'], '1h');

      await Mailer.send(
        'ResetPasswordLink',
        {
          email,
          token,
          link: `${process.env.HOST}/reset-password?token=${token}`
        },
        {
          from: `${Config.name} <${Config.noReplyEmail}>`,
          to: email,
          subject: `${Config.name} password reset`
        }
      );
    }

    /**
     * Sets the users password
     *
     * @param {String} password Password to set
     */
    async setPassword(password) {
      this.password = await this.constructor.asyncHashPassword(password);
      this.is_activated = true;
      this.invite_pending = false;
      await this.save();
      return this;
    }

    /**
     * Signups a user
     *
     * @param {Object} data Data for the user to sign up
     */
    static async signup(data) {
      const transaction = await this.sequelize.transaction();
      let user, account;

      try {
        const models = this.sequelize.models;

        account = models.Account.build({
          name: data.company_name || data.email,
          notification_emails: data.email
        });
        user = models.User.build({
          account_id: account.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: await this.asyncHashPassword(data.password),
          role: 'Super Admin'
        });

        await Promise.all([
          user.save({ transaction }),
          account.save({ transaction })
        ]);

        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw err;
      }

      try {
        user.account = account;

        if (!user.hubspot_contact_id) {
          await this.syncWithHubspot(user);
        }
      } catch (err) {
        await Promise.all([user.destroy(), account.destroy()]);
        throw err;
      }

      await user.sendActivationEmail();

      return user;
    }

    /**
     * Syncs a user with hubspot
     *
     * @param {User} user User to sync with hubspot
     */
    static async syncWithHubspot(user) {
      const hapiKey = config.hubspot.apiKey;

      if (!hapiKey) {
        return;
      }

      const models = this.sequelize.models;

      if (!user.account && user.account_id) {
        user.account = await models.Account.findOne({
          where: { id: user.account_id },
          raw: true
        });
      }

      const hubspot = await Hubspot.getDataForEmail(user.email, user);

      if (hubspot && hubspot.contact && hubspot.contact.vid) {
        user.hubspot_contact_id = hubspot.contact.vid;
        await models.User.update(
          { hubspot_contact_id: hubspot.contact.vid },
          { where: { id: user.id } }
        );
      }

      if (
        hubspot.contact &&
        hubspot.contact['associated-company'] &&
        hubspot.contact['associated-company']['company-id']
      ) {
        user.account.hubspot_company_id =
          hubspot.contact['associated-company']['company-id'];
        await models.Account.update(
          {
            hubspot_company_id:
              hubspot.contact['associated-company']['company-id']
          },
          { where: { id: user.account_id } }
        );
      }
    }

    /**
     * Verifies a password for the user
     *
     * @param {String} password Password to verifyf
     */
    async verifyPassword(password) {
      try {
        const hashed = await this.constructor.asyncHashPassword(password);
        return password && this.password && hashed === this.password;
      } catch (err) {
        return false;
      }
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      account_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      hubspot_contact_id: {
        type: DataTypes.STRING,
        unique: true
      },
      name: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.first_name} ${this.last_name}`;
        },
        set() {
          throw new Error('Do not try to set the `name` value!');
        }
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        canCreate: true,
        canUpdate: true,
        searchable: true
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        canCreate: true,
        canUpdate: true,
        searchable: true
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'Basic'
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        canCreate: true,
        canUpdate: true,
        searchable: true
      },
      password: { type: DataTypes.STRING },
      is_activated: { type: DataTypes.BOOLEAN },
      activation_code: { type: DataTypes.STRING },
      activation_code_expiration_date: { type: DataTypes.DATE },
      profile_picture: {
        type: DataTypes.TEXT,
        canCreate: false,
        canUpdate: false
      },
      last_active_at: { type: DataTypes.DATE },
      invite_pending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_deactivated: { type: DataTypes.BOOLEAN },
      created_by_id: {
        type: DataTypes.UUID
      },
      updated_by_id: {
        type: DataTypes.UUID
      }
    },
    {
      sequelize,
      modelName: 'User',
      schema: 'app',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeFind: (options) => {
          options.attributes = options.attributes || {};
          options.attributes.exclude = ['password'];
          return options;
        }
      }
    }
  );

  User.addHook('afterCreate', 'inviteUser', User.inviteUser);
  User.addHook('beforeCreate', 'conditionalDefaults', (user) => {
    if (!user.password) {
      user.invite_pending = true;
    }
  });

  return User;
};
