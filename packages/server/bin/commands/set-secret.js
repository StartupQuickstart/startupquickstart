const crypto = require('crypto');
const { AwsParamStore } = require('../../dist/lib/aws/param-store');

module.exports = (cli) => {
  return async (bytes = 64, opts) => {
    try {
      const options = Object.assign(cli.opts(), opts);
      const key = `shared/_/secret`;

      const existing = await AwsParamStore.get(
        key,
        options.env,
        process.env.APP
      );

      if (existing) {
        console.log('Secret is already set');
      } else {
        const secret = crypto.randomBytes(bytes).toString('hex');
        await AwsParamStore.upsert(key, secret, {
          encrypted: true,
          env: options.env
        });
      }
    } catch (err) {
      console.log(err);
    }

    process.exit();
  };
};
