import prompt from 'prompt';
import AwsParamStore from '@/lib/aws/param-store';
import { google } from 'googleapis';
import dotenv from 'dotenv';

(async () => {
  const SCOPES = ['https://mail.google.com/'];

  async function getOAuth2Client(env) {
    let config = await AwsParamStore.getByPath('/shared/google/', env);

    if (!config['client-id'] || !config['client-secret']) {
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

      await Promise.all([
        AwsParamStore.upsert('/shared/google/client-id', clientId, {
          encrypted: false,
          env,
          replaceExisting: true
        }),
        AwsParamStore.upsert('/shared/google/client-secret', clientSecret, {
          encrypted: true,
          env,
          replaceExisting: true
        })
      ]);

      config = await AwsParamStore.getByPath('/shared/google/', env);
    }

    const oAuth2Client = new google.auth.OAuth2(
      config['client-id'],
      config['client-secret'],
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
          return reject('Error while trying to retrieve access token: ' + err);
        }
        return resolve(token);
      });
    });
  }

  try {
    const env = process.env.ENV || 'dev';
    const url = await getAuthorizationUrl(env);

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

    const tokens = await getToken(code, env);

    await Promise.all([
      AwsParamStore.upsert(
        '/shared/google/refresh-token',
        tokens.refresh_token,
        {
          encrypted: true,
          env: env,
          replaceExisting: true
        }
      ),
      AwsParamStore.upsert('/shared/google/access-token', tokens.access_token, {
        encrypted: true,
        env: env,
        replaceExisting: true
      })
    ]);

    prompt.message = 'EMAIL';
    const { email } = await prompt.get([
      {
        name: 'email',
        message: 'What users email address was authorized to send emails?',
        required: true
      }
    ]);

    await AwsParamStore.upsert('/shared/google/user', email, {
      encrypted: false,
      env: env,
      replaceExisting: true
    });
  } catch (err) {
    console.log(err);
  }
  process.exit();
})();
