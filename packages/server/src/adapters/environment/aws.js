import dotenv from 'dotenv';
import { ssm, secretsManager } from '@/lib/aws';

dotenv.config();

export async function load(config) {
  console.log('Loading environment config from AWS.');
  const svc = process.env.SERVICE || 'app';
  const [
    stripe,
    appSecret,
    requireSubscription,
    hubspotApiKey,
    google,
    database
  ] = await Promise.all([
    ssm.getParam('/shared/stripe'),
    ssm.getParam(`/shared/_/secret`),
    ssm.getParam('/shared/_/require-subscription'),
    ssm.getParam('/shared/hubspot/hapi-key'),
    ssm.getParam('/shared/google'),
    secretsManager.getSecret(`/${svc}-database/users/svc_app/creds`)
  ]).catch((err) => {
    if (err.code === 'CredentialsError') {
      throw new Error(err.message);
    }

    throw err;
  });

  const awsConfig = {
    app: {
      requireSubscription: requireSubscription || false
    },
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
      secretKey: stripe?.secretKey,
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
