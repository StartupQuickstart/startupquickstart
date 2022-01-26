import dotenv from 'dotenv';
import { AwsParamStore, Env } from '@/adapters/environment';

dotenv.config();

export const config = {
  server: {
    host: process.env.HOST || 'http://localhost:3000',
    port: process.env.PORT || 3000
  },
  app: {
    name: process.env.APP,
    legalName: '',
    website: '',
    termsOfService: '',
    privacyPolicy: '',
    address: '',
    supportEmail: '',
    logo: '',
    host: '',
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
export async function load() {
  const adapters = [];
  const envAdapters = (process.env.ENV_ADAPTERS || '')
    .split(',')
    .map((adapter) => adapter.trim());

  if (envAdapters.includes('aws')) {
    adapters.push(AwsParamStore);
  }

  await Env.load(config);
  await Promise.all(adapters.map((adapter) => adapter.load(config)));
  return config;
}

export default config;
