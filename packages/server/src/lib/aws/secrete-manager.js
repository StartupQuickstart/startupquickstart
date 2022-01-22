import { SecretsManager } from 'aws-sdk';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 });

const secretsManager = new SecretsManager({ region: 'us-east-1' });

export default class AwsSecretManager {
  /**
   * Gets the param value by an exact path
   *
   * @param {String} path Path to get param at
   */
  static async get(path, user = 'svc_app', env = process.env.ENV, app = process.env.APP) {
    const base = `/${app}/${user}/${env}/`;
    const fullPath = `${base}${path}`;

    if (cache.has(fullPath)) {
      return cache.get(fullPath);
    }

    const result = await secretsManager.getSecretValue({ SecretId: fullPath }).promise();

    if (result && result.SecretString) {
      const value = JSON.parse(result.SecretString);
      cache.set(fullPath, value);
      return value;
    }

    return null;
  }
}
