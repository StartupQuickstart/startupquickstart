import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import config from '@/config';
import models from '@/api/models';
import crypto from 'crypto';
import sequelize, { Op } from 'sequelize';
import OAuth2Config from './oauth2.config';

export class OAuth2 {
  /**
   * Generate a new access token
   * @param {Object} client The client object
   * @param {Object} user The user object
   * @param {String} scope  The scope of the token
   * @returns {String} The access token
   */
  static async generateAccessToken(client, user, scope, next) {
    try {
      const token = this.generateToken(
        client,
        user,
        scope,
        OAuth2Config.accessTokenLifetime
      );
      return next(null, token);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Generate a new refresh token
   * @param {Object} client The client object
   * @param {Object} user The user object
   * @param {String} scope  The scope of the token
   * @returns {String} The refresh token
   */
  static async generateRefreshToken(client, user, scope, next) {
    try {
      const token = this.generateToken(
        client,
        user,
        scope,
        OAuth2Config.refreshTokenLifetime
      );

      return next(null, token);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Generate a new token
   * @param {Object} client The client object
   * @param {Object} user The user object
   * @param {String} scope  The scope of the token
   * @param {Numeric} expiresIn The expiration time of the token
   * @returns {String} The refresh token
   */
  static async generateToken(client, user, scope, expiresIn) {
    const token = jwt.sign(
      {
        sub: user.id,
        iss: config.server.host,
        aud: 'api://default',
        scope: scope,
        jti: Date.now() + crypto.randomBytes(10).toString('hex'),
        client_id: client.id,
        account_id: client.account_id
      },
      client.privateKey,
      { algorithm: 'RS256', expiresIn }
    );

    return token;
  }

  /**
   * Generates an authorization code
   * @returns {String} The authorization code
   */
  static generateAuthorizationCode(client, user, scope, next) {
    try {
      const seed = crypto.randomBytes(256);
      return next(null, crypto.createHash('sha1').update(seed).digest('hex'));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Gets a saved access token
   * @param {String} accessToken The access token
   * @returns {Object} The access token object
   */
  static async getAccessToken(accessToken, next) {
    try {
      const payload = jwt.decode(accessToken);
      const client = await models.OAuth2Client.findOne({
        where: { id: payload.client_id },
        attributes: ['public_key']
      });

      if (!client) {
        return next(null, null);
      }

      const isValid = jwt.verify(accessToken, client.public_key);

      if (!isValid) {
        return next(null, null);
      }

      return next(null, {
        accessToken,
        accessTokenExpiresAt: new Date(payload.exp * 1000),
        scope: payload.scope,
        client: { id: payload.client_id },
        user: { id: payload.sub }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Gets a saved refresh token
   * @param {String} refreshToken The refresh token
   * @returns {Object} The refresh token object
   */
  static async getRefreshToken(refreshToken, next) {
    try {
      const payload = jwt.decode(refreshToken);
      const client = await models.OAuth2Client.findOne({
        where: { id: payload.client_id },
        attributes: ['public_key']
      });

      if (!client) {
        return next(null, null);
      }

      const isValid = jwt.verify(refreshToken, client.public_key);

      if (!isValid) {
        return next(null, null);
      }

      return next(null, {
        refreshToken,
        refreshTokenExpiresAt: new Date(payload.exp * 1000),
        scope: payload.scope,
        client: { id: payload.client_id },
        user: { id: payload.sub }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Gets a saved authorization code
   * @param {String} authorizationCode The authorization code
   * @returns {Object} The authorization code object
   */
  static async getAuthorizationCode(authorizationCode, next) {
    try {
      const code = await models.OAuth2Token.findOne({
        where: { token: authorizationCode, token_type: 'authorization_code' },
        attributes: [
          'token',
          'expires_at',
          'id',
          'client_id',
          'user_id',
          'scope'
        ]
      });

      if (!code) {
        return next(null, null);
      }

      return next(null, {
        authorizationCode,
        expiresAt: code.expires_at,
        scope: code.scope,
        client: { id: code.client_id },
        user: { id: code.user_id }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Gets a saved client
   * @param {String} clientId The client id
   * @param {String} clientSecret The client secret
   * @returns {Object} The client object
   */
  static async getClient(clientId, clientSecret, next) {
    try {
      const query = { id: clientId };

      if (clientSecret) {
        query.client_secret = clientSecret;
      }

      const client = await models.OAuth2Client.findOne({
        where: query,
        attributes: [
          'id',
          'redirect_uris',
          'name',
          'grants',
          'private_key',
          'public_key'
        ]
      });

      return next(null, {
        id: client.id,
        grants: client.grants,
        redirectUris: client.redirect_uris,
        grants: client.grants,
        name: client.name,
        publicKey: client.public_key,
        privateKey: client.private_key
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Gets a user from the database
   * @param {String} email The email of the user
   * @param {String} password The password of the user
   * @returns {Object} The user object
   */
  static async getUser(email, password, next) {
    try {
      const hashed = await models.User.asyncHashPassword(password);
      const user = await models.User.findOne({
        where: { email, password: hashed, is_deactivated: false }
      });
      return next(null, user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Revokes a refresh token
   * @param {String} token The refresh token
   * @returns {Boolean} True if the token was revoked
   */
  static async revokeToken(token, next) {
    try {
      const refreshToken = await promisify(this.getRefreshToken)(
        token.refreshToken
      );
      if (!refreshToken) {
        return next(null, false);
      }

      const payload = jwt.decode(token.refreshToken);

      await models.OAuth2Token.create({
        token: token.refreshToken,
        token_type: 'revoked_token',
        user_id: payload.user_id,
        scope: payload.scope,
        expires_at: new Date(payload.exp * 1000)
      });
      return next(null, true);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Revokes an authorization code
   * @param {String} code The authorization code
   * @returns Returns true if the code was revoked
   */
  static async revokeAuthorizationCode(code, next) {
    try {
      const authcode = await promisify(this.getAuthorizationCode)(
        code.authorizationCode
      );
      if (!authcode) {
        return next(null, false);
      }
      await models.OAuth2Token.destroy({
        where: { token: authcode.authorizationCode }
      });
      return next(null, true);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Save an access token
   * NOTE: We are using stateless tokens so we don't need to save them
   * @param {String} token The token object to save
   * @param {Object} client The client object
   * @param {Object} user The user object
   * @returns {Object} The saved token object
   */
  static async saveToken(token, client, user, next) {
    try {
      return next(null, {
        ...token,
        client: { id: token.client_id },
        user: { id: token.sub }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Save an authorization code
   * @param {String} code The authorization code object to save
   * @param {Object} client The client object
   * @param {Object} user The user object
   * @returns {Object} The saved authorization code object
   */
  static async saveAuthorizationCode(code, client, user, next) {
    try {
      const authcode = {
        token_type: 'authorization_code',
        token: code.authorizationCode,
        expires_at: code.expiresAt,
        scope: code.scope,
        client_id: client.id,
        user_id: user.id
      };
      await models.OAuth2Token.create(authcode);
      await models.OAuth2Token.destroy({
        where: {
          expires_at: { [Op.lt]: sequelize.literal('CURRENT_TIMESTAMP') }
        }
      });

      return next(null, {
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        scope: code.scope,
        client: { id: client.id },
        user: { id: user.id }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Validates a scope
   * @param {Object} user User object
   * @param {Object} client Client object
   * @param {Array} scope Array of scopes
   * @returns {Boolean} True if the scope is valid
   */
  static async validateScope(user, client, scope, next) {
    try {
      const VALID_SCOPES = ['read_only', 'read_write'];
      if (!scope?.split(',')?.every((s) => VALID_SCOPES.includes(s))) {
        return next(null, false);
      }
      return next(null, scope);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verifies if a user is authorized to access a client
   * @param {Object} token The token object
   * @param {Array} requestedScopes Array of scopes
   * @returns
   */
  static async verifyScope(token, requestedScopes, next) {
    try {
      if (!token.scope) {
        return next(null, false);
      }

      const authorizedScopes = token.scope;
      return next(
        null,
        requestedScopes.every((requestedScope) =>
          authorizedScopes.includes(requestedScope)
        )
      );
    } catch (err) {
      next(err);
    }
  }
}

export default OAuth2;
