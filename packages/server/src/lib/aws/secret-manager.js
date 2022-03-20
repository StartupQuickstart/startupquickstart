import { SecretsManager } from 'aws-sdk';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 });

const secretsManager = new SecretsManager({ region: 'us-east-1' });

export class AwsSecretManager {
  /**
   * Gets the param value by an exact path
   *
   * @param {String} path Path to get param at
   */
  static async get(path, env = process.env.ENV, app = process.env.APP) {
    const base = `/${app}/${env}`;
    const fullPath = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

    if (cache.has(fullPath)) {
      return cache.get(fullPath);
    }

    try {
      const result = await secretsManager
        .getSecretValue({ SecretId: fullPath })
        .promise();
    } catch (err) {
      console.log(`Could not find secret at ${fullPath}`);
      if (err.code === 'ResourceNotFoundException') {
        return null;
      }
    }

    if (result && result.SecretString) {
      const value = JSON.parse(result.SecretString);
      cache.set(fullPath, value);
      return value;
    }

    return null;
  }
}

export default AwsSecretManager;
