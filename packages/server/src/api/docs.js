import swaggerUi from 'swagger-ui-express';
import config from '@/config';
import routes from './routes';
import { models } from './models';
import { docs as accountDocs } from './v1/account/account.routes';
import { docs as userDocs } from './v1/user/user.routes';
import { docs as mediaDocs } from './v1/media/media.routes';

export function init(app) {
  const docs = require('./openapi.js').default;

  var options = {
    customCss: '.swagger-ui .topbar { display: none }'
  };

  docs.paths = {
    ...accountDocs,
    ...mediaDocs,
    ...userDocs
  };

  for (const modelName in models) {
    const model = models[modelName];

    docs.tags.push({ name: modelName });

    const modelSchema = { type: 'object', properties: {} };

    for (const fieldName in model.tableAttributes) {
      const attribute = model.tableAttributes[fieldName];
      const type = attribute.type.constructor.name.toLowerCase();

      const doc = {
        uuid: { type: 'string', format: 'uuid' },
        text: { type: 'string' },
        date: { type: 'string', format: 'date-time' }
      }[type] || { type };

      modelSchema.properties[fieldName] = doc;
    }

    docs.components.schemas[modelName] = modelSchema;
  }

  app.use('/api', swaggerUi.serve, swaggerUi.setup(docs, options));
}

export default { init };
