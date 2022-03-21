import {
  SecretsManagerClient,
  PutSecretValueCommand,
  GetSecretValueCommand,
  CreateSecretCommand
} from '@aws-sdk/client-secrets-manager';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 });

export class secretsManager {
  static client = new SecretsManagerClient();

  /**
   * Gets the path to the secret
   * @param {String} name Name of the secret
   * @param {String} env Environment to get the secret for
   * @param {String} app App to get the secret for
   * @returns {String} Path to the secret
   */
  static getName(name, env = process.env.ENV, app = process.env.APP) {
    return `/${app}/${env}${name.startsWith('/') ? '' : '/'}${name}`;
  }

  /**
   * Gets a secret manager value
   *
   * @param {String} secretId Id of the secret
   * @param {Object} options Any other options you want to pass in.
   * @returns {Object} Result of the set call
   */
  static async getSecret(name, env = process.env.ENV, app = process.env.APP) {
    let result, fullName;
    try {
      fullName = this.getName(name);

      if (cache.has(fullName)) {
        return cache.get(fullName);
      }

      const command = new GetSecretValueCommand({
        SecretId: fullName,
        WithDecryption: true
      });
      result = await this.client.send(command);
    } catch (err) {
      if (err.name === 'ResourceNotFoundException') {
        result = { SecretString: null };
      } else {
        throw err;
      }
    }

    let value = result.SecretString;

    try {
      value = JSON.parse(value);
    } catch (err) {}

    cache.set(fullName, value);

    return value;
  }
}

export default secretsManager;
