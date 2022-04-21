import path from 'path';
import dotenv from 'dotenv';
import { Aws, Env } from '@/adapters/environment';

dotenv.config();

export const config = {
  server: {
    host: process.env.HOST || 'http://localhost:3501',
    publicHost:
      process.env.PUBLIC_HOST || process.env.HOST || 'http://localhost:3000',
    port: process.env.PORT || 3501
  },
  app: {
    name: process.env.APP,
    legalName: 'Startup Quickstart, LLC',
    website: 'https://www.startupquickstart.com',
    termsOfService: 'https://www.startupquickstart.com/terms-of-service',
    privacyPolicy: 'https://www.startupquickstart.com/privacy-policy',
    address: 'East Boston, MA',
    supportEmail: 'support@startupquickstart.com',
    noReplyEmail: 'noreply@startupquickstart.com',
    logo: {
      src: 'http://localhost:3500/static/media/logo.c65011228bd2c6f8bb3f.png',
      width: 91,
      height: 45
    },
    emailStylePath: path.resolve(__dirname, './emails/dist/styles.css'),
    host: process.env.HOST || 'http://localhost:3501',
    pricing: {},
    setupItems: {}
  },
  request: {
    bodyLimit: process.env.REQUEST_BODY_LIMIT || '50mb'
  },
  logging: {
    type: process.env.LOG_TYPE || 'tiny'
  },
  scopes: {
    'read:admin': {
      name: 'Read Admin',
      description: 'Read Admin',
      objects: ['all']
    },
    'write:admin': {
      name: 'Write Admin',
      description: 'Write Admin',
      objects: ['all']
    },
    'read:basic': {
      name: 'Read Admin',
      description: 'Read Admin'
    },
    'write:basic': {
      name: 'Write Basic',
      description: 'Write Basic'
    }
  },
  roles: {
    super_admin: {
      name: 'Super Admin',
      description: 'Super Admin',
      scopes: ['read:admin', 'write:admin']
    },
    admin: {
      name: 'Admin',
      description: 'Admin role',
      scopes: ['read:admin', 'write:admin']
    },
    basic: {
      name: 'Basic',
      description: 'Basic user role',
      scopes: ['read:basic', 'write:basic']
    },
    read_only: {
      name: 'Read Only',
      description: 'Read only user role',
      scopes: ['read:basic']
    }
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
    adapters.push(Aws);
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
