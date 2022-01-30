import dotenv from 'dotenv';
import AwsParamStore from '@/lib/aws/param-store';
import AwsSecretManager from '@/lib/aws/secret-manager';

dotenv.config();

export async function load(config) {
  console.log('Loading environment config from AWS.');

  const [stripe, appSecret, hubspotApiKey, google, database] =
    await Promise.all([
      AwsParamStore.getByPath('/shared/stripe'),
      AwsParamStore.get(`/shared/app/secret`),
      AwsParamStore.get('/shared/hubspot/hapi-key'),
      AwsParamStore.getByPath('/shared/google/'),
      AwsSecretManager.get('db/creds', 'svc_app')
    ]);

  const awsConfig = {
    enc: {
      secret: appSecret
    },
    database,
    google: {
      user: google['user'],
      clientId: google['client-id'],
      clientSecret: google['client-secret'],
      refreshToken: google['refresh-token']
    },
    hubspot: {
      apiKey: hubspotApiKey
    },
    stripe: {
      apiKey: stripe['key'],
      publishableKey: stripe['publishable-key']
    }
  };

  for (const key in awsConfig) {
    if (config[key]) {
      config[key] = { ...config[key], ...awsConfig[key] };
    } else {
      config[key] = awsConfig[key];
    }
  }

  return config;
}
