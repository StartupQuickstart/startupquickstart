'use strict';
import uuid from 'uuid-by-string';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '@/config';

module.exports = {
  /**
   * Seeds the default OAuth2 client to be used by the application for authentication
   */
  async up(queryInterface, Sequelize) {
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

    const client = {
      id: uuid('Default OAuth2 Client'),
      account_id: uuid('Default OAuth2 Client'),
      name: 'Default OAuth2 Client',
      client_secret: crypto.randomBytes(32).toString('hex'),
      redirect_uris: [config.server.host + '/api/v1/oauth2/default/callback'],
      grants: ['authorization_code', 'refresh_token'],
      scope: ['full_access'],
      public_key: publicKey,
      private_key: privateKey
    };

    await queryInterface.bulkInsert('oauth2_clients', [client]);
  },

  async down(queryInterface, Sequelize) {}
};
