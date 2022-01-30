import SSM from 'aws-param-store';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 });

export class AwsParamStore {
  /**
   * Gets the param value by an exact path
   *
   * @param {String} path Path to get param at
   */
  static async get(path, env = process.env.ENV, app = process.env.APP) {
    const base = `/${app}/${env}${path.startsWith('/') ? '' : '/'}`;
    const fullPath = `${base}${path}`;

    if (cache.has(fullPath)) {
      return cache.get(fullPath);
    }

    const result = await SSM.getParameter(fullPath).catch((err) => {
      if (err.code === 'ParameterNotFound') {
        return null;
      }

      throw err;
    });

    if (result && result.Value) {
      cache.set(fullPath, result.Value);
      return result.Value;
    }

    return null;
  }

  /**
   * Gets the param values by a path
   *
   * @param {String} path Path to get params at
   */
  static async getByPath(path, env = process.env.ENV, app = process.env.APP) {
    const params = {};
    const base = `/${app}/${env}`;
    const fullPath = `${base}${path}`;

    const result = await SSM.getParametersByPath(fullPath);

    result.forEach((param) => {
      params[param.Name.replace(fullPath, '').replace(/^\//, '')] = param.Value;
    });

    return params;
  }

  /**
   * Upsers the param value
   *
   * @param {String} path Path to upsert
   * @param {Any} value Value to upsert
   * @param {Object} options Options to use
   */
  static async upsert(path, value, options = {}) {
    options = Object.assign(
      { env: process.env.ENV, app: process.env.APP, encrypted: false },
      options
    );

    const fullPath = `/${options.app}/${options.env}${
      path.startsWith('/') ? path : '/' + path
    }`;

    const param = await this.get(path, options.env, options.app);

    if (!param || options.replaceExisting) {
      console.log(`Creating param store value at path ${fullPath}. (Adding)`);
      await SSM.putParameter(
        fullPath,
        value,
        options.encrypted ? 'SecureString' : 'String',
        {
          region: 'us-east-1'
        }
      );
    } else {
      console.log(
        `Param store value at path ${fullPath} already exists. (Skipping)`
      );
    }
  }
}

export default AwsParamStore;
