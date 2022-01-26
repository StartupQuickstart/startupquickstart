import dotenv from 'dotenv';
import { AwsParamStore, Env } from '@/adapters/environment';

dotenv.config();

export const config = {
  server: {
    host: process.env.HOST || 'http://localhost:3001',
    publicHost:
      process.env.PUBLIC_HOST || process.env.HOST || 'http://localhost:3000',
    port: process.env.PORT || 3001
  },
  app: {
    name: process.env.APP,
    legalName: 'SuggestEdit, LLC',
    website: 'https://www.startupquickstart.com',
    termsOfService: 'https://www.startupquickstart.com/terms-of-service',
    privacyPolicy: 'https://www.startupquickstart.com/privacy-policy',
    address: 'East Boston, MA',
    supportEmail: 'support@startupquickstart.com',
    noReplyEmail: 'noreply@startupquickstart.com',
    logo: {
      src: 'http://localhost:3000/static/media/logo.c65011228bd2c6f8bb3f.png',
      width: 91,
      height: 45
    },
    host: process.env.HOST || 'http://localhost:3001',
    pricing: {},
    setupItems: {}
  },
  request: {
    bodyLimit: process.env.REQUEST_BODY_LIMIT || '50mb'
  },
  logging: {
    type: process.env.LOG_TYPE || 'tiny'
  }
};

/**
 * Loads the async config
 */
export async function loadConfig() {
  if (config.loaded) {
    return config;
  }

  const adapters = [];
  const envAdapters = (process.env.ENV_ADAPTERS || '')
    .split(',')
    .map((adapter) => adapter.trim());

  if (envAdapters.includes('aws')) {
    adapters.push(AwsParamStore);
  }

  await Env.load(config);
  await Promise.all(adapters.map((adapter) => adapter.load(config)));
  config.loaded = true;

  return config;
}

/**
 * Allows the user to override the app config
 *
 * @param {Object} appConfig App config to set
 */
export function setAppConfig(appConfig) {
  for (const key in appConfig) {
    config.app[key] = appConfig[key];
  }
}

export default config;
