const crypto = require('crypto');
const { ssm } = require('../../dist/lib/aws');

module.exports = (cli) => {
  return async (bytes = 64, opts) => {
    try {
      const options = Object.assign(cli.opts(), opts);
      const key = `shared/_/secret`;

      const existing = await ssm.getParam(key, options.env, process.env.APP);

      if (existing) {
        console.log('Secret is already set');
      } else {
        const secret = crypto.randomBytes(bytes).toString('hex');
        await ssm.setParam(key, secret, true, options.env);
      }
    } catch (err) {
      console.log(err);
    }

    process.exit();
  };
};
