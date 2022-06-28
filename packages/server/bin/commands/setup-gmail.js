const inquirer = require('inquirer');
const { ssm } = require('../../dist/lib/aws');
const { google } = require('googleapis');
const dotenv = require('dotenv');

module.exports = (cli) => {
  return async (opts) => {
    const options = Object.assign(cli.opts(), opts);

    const SCOPES = ['https://mail.google.com/'];

    async function getOAuth2Client(env, collect = false) {
      const config =
        (await ssm.getParam('/shared/google', { env, cached: false })) || {};

      if (collect || !config.clientId || !config.clientSecret) {
        const { clientId, clientSecret } = await inquirer.prompt([
          {
            name: 'clientId',
            message: 'Google Client ID',
            type: 'input',
            required: true,
            askAnswered: true,
            default: config.clientId
          },
          {
            name: 'clientSecret',
            message: 'Google Client Secret',
            type: 'input',
            required: true,
            askAnswered: true,
            default: config.clientSecret
          }
        ]);

        config.clientId = clientId;
        config.clientSecret = clientSecret;

        await ssm.setParam('/shared/google', config, true, env);
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
      const env = options.env;
      const client = await getOAuth2Client(env, true);
      const url = await getAuthorizationUrl(env);
      const config = (await ssm.getParam('/shared/google', { env })) || {};

      console.log('----------------Gmail Setup----------------');
      console.log('Authorize this app by visiting this url:');
      console.log('');
      console.log(url);
      console.log('');

      const { code } = await inquirer.prompt([
        {
          name: 'code',
          message: 'Enter the code from that page here',
          required: true
        }
      ]);

      const tokens = await getToken(code, env);

      const { user } = await inquirer.prompt([
        {
          name: 'user',
          message: 'What users email address was authorized to send emails?',
          required: true,
          askAnswered: true,
          default: config.user
        }
      ]);

      config.refreshToken = tokens.refresh_token;
      config.accessToken = tokens.access_token;
      config.user = user;

      await ssm.setParam('/shared/google', config, true, env);
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
};
