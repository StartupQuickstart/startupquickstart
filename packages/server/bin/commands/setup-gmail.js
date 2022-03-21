const prompt = require('prompt');
const { ssm } = require('../../dist/lib/aws');
const { google } = require('googleapis');
const dotenv = require('dotenv');

module.exports = (cli) => {
  return async (opts) => {
    const options = Object.assign(cli.opts(), opts);

    const SCOPES = ['https://mail.google.com/'];

    async function getOAuth2Client(env, collect = true) {
      let config = (await ssm.getParam('/shared/google', env)) || {};

      if (
        (!config.clientId || !config.clientSecret || options.force) &&
        collect
      ) {
        prompt.message = 'ENTER';
        const { clientId, clientSecret } = await prompt.get([
          {
            name: 'clientId',
            message: 'Google Api CLIENT_ID',
            required: true
          },
          {
            name: 'clientSecret',
            message: 'Google Api CLIENT_SECRET',
            required: true
          }
        ]);

        config.clientId = clientId;
        config.clientSecret = clientSecret;

        ssm.setParam('/shared/google', config, true, env);
      }

      const oAuth2Client = new google.auth.OAuth2(
        config.clientId,
        config.clientSecret,
        'urn:ietf:wg:oauth:2.0:oob'
      );
      oAuth2Client.setCredentials({
        refresh_token: config['refresh-token'],
        access_token: config['access-token']
      });

      return oAuth2Client;
    }

    async function getAuthorizationUrl(env) {
      const client = await getOAuth2Client(env);

      return await client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      });
    }

    function getToken(code, env) {
      return new Promise(async (resolve, reject) => {
        const client = await getOAuth2Client(env);
        client.getToken(code, function (err, token) {
          if (err) {
            return reject(
              'Error while trying to retrieve access token: ' + err
            );
          }
          return resolve(token);
        });
      });
    }

    try {
      const url = await getAuthorizationUrl(options.env);

      console.log('----------------Gmail Setup----------------');
      console.log('Authorize this app by visiting this url:');
      console.log('');
      console.log(url);
      console.log('');

      prompt.message = 'CODE';
      const { code } = await prompt.get([
        {
          name: 'code',
          message: 'Enter the code from that page here',
          required: true
        }
      ]);

      const tokens = await getToken(code, options.env);

      prompt.message = 'EMAIL';
      const { email } = await prompt.get([
        {
          name: 'email',
          message: 'What users email address was authorized to send emails?',
          required: true
        }
      ]);

      config.refreshToken = tokens.refresh_token;
      config.accessToken = tokens.access_token;
      config.user = email;

      await ssm.setParam('/shared/google', config, true, options.env);
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
};
