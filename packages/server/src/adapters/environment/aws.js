import dotenv from 'dotenv';
import { ssm, secretsManager } from '@/lib/aws';

dotenv.config();

export async function load(config) {
  console.log('Loading environment config from AWS.');
  const [stripe, appSecret, hubspotApiKey, google, database] =
    await Promise.all([
      ssm.getParam('/shared/stripe'),
      ssm.getParam(`/shared/_/secret`),
      ssm.getParam('/shared/hubspot/hapi-key'),
      ssm.getParam('/shared/google'),
      secretsManager.getSecret('/app-database/users/master/creds')
    ]).catch((err) => {
      if (err.code === 'CredentialsError') {
        throw new Error(err.message);
      }

      throw err;
    });

  const awsConfig = {
    enc: {
      secret: appSecret
    },
    database,
    google: {
      user: google?.user,
      clientId: google?.clientId,
      clientSecret: google?.clientSecret,
      refreshToken: google?.refreshToken
    },
    hubspot: {
      apiKey: hubspotApiKey
    },
    stripe: {
      apiKey: stripe?.key,
      publishableKey: stripe?.publishableKey
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
