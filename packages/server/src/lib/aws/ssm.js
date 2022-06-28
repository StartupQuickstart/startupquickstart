import {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
  DeleteParameterCommand
} from '@aws-sdk/client-ssm';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 });

export class ssm {
  static client = new SSMClient();

  /**
   * Gets the path to the param
   * @param {String} name Name of the param
   * @param {String} env Environment to get the param for
   * @param {String} app App to get the param for
   * @returns {String} Path to the param
   */
  static getName(name, env = process.env.ENV, app = process.env.APP) {
    return `/${app}/${env}${name.startsWith('/') ? '' : '/'}${name}`;
  }

  /**
   * Delets a parameter store value
   *
   * @param {String} name Name of the parameter store
   * @param {String|Object} value Value of the parameter store
   * @param {Boolean} encrypted Whether or not the value was encrypted
   * @param {String} env Environment to set the param for
   * @param {String} app App to set the param for
   */
  static deleteParam(
    name,
    value,
    encrypted = false,
    env = process.env.ENV,
    app = process.env.APP
  ) {
    const _value = typeof value === 'string' ? value : JSON.stringify(value);

    const fullName = this.getName(name, env, app);

    cache.del(fullName);

    const command = new DeleteParameterCommand({ Name: fullName });
    return this.client.send(command);
  }

  /**
   * Sets a parameter store value
   *
   * @param {String} name Name of the parameter store
   * @param {String|Object} value Value of the parameter store
   * @param {Boolean} encrypted Whether or not the value was encrypted
   * @param {String} env Environment to set the param for
   * @param {String} app App to set the param for
   */
  static setParam(
    name,
    value,
    encrypted = false,
    env = process.env.ENV,
    app = process.env.APP
  ) {
    const _value = typeof value === 'string' ? value : JSON.stringify(value);

    const fullName = this.getName(name, env, app);

    cache.set(fullName, _value);

    const command = new PutParameterCommand({
      Name: fullName,
      Value: _value,
      Encrypted: encrypted,
      Type: encrypted ? 'SecureString' : 'String',
      Overwrite: true
    });
    return this.client.send(command);
  }

  /**
   * Gets a parameter store value
   *
   * @param {String} name Name of the parameter store
   * @param {Object} options Options to pass to the get command
   * @returns {Object} Result of the get call
   */
  static async getParam(name, options = {}) {
    let result, fullName;
    try {
      const { env, app, cached } = Object.assign(
        {
          env: process.env.ENV,
          app: process.env.APP,
          cached: true
        },
        options
      );

      fullName = this.getName(name, env, app);

      if (cache.has(fullName) && cached) {
        return cache.get(fullName);
      }

      const command = new GetParameterCommand({
        Name: fullName,
        WithDecryption: true
      });
      result = await this.client.send(command);
    } catch (err) {
      if (err.name === 'ParameterNotFound') {
        result = { Parameter: { Value: null } };
      } else {
        throw err;
      }
    }

    let value = result.Parameter.Value;

    try {
      value = JSON.parse(value);
    } catch (err) {}

    cache.set(fullName, value);

    return value;
  }
}

export default ssm;
