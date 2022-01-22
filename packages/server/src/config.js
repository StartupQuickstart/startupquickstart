import dotenv from 'dotenv';

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

export default config;
