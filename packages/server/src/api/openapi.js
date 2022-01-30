import config from '@/config';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    description: `Documentation for ${config.app.name}.`,
    version: '1.0.0',
    title: `${config.app.name} REST API Docs`,
    termsOfService: config.app.termsOfService,
    contact: {
      email: config.app.supportEmail
    }
  },
  host: config.host,
  basePath: '/api',
  tags: [],
  schemes: ['https'],
  paths: {},
  components: { schemas: {} }
};

export default swaggerDocument;
