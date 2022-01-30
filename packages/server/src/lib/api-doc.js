export const defaultRoutes = [
  'index',
  'create',
  'read',
  'update',
  'delete',
  'count',
  'related',
  'describe'
];

export const apiQueryParameters = [
  {
    in: 'query',
    name: 'limit',
    required: false,
    schema: { type: 'integer', minimum: 1 },
    description: 'The numbers of items to return'
  },
  {
    in: 'query',
    name: 'offset',
    required: false,
    schema: { type: 'integer', minimum: 0 },
    description:
      'The number of items to skip before starting to collect the result set'
  },
  {
    in: 'query',
    name: 'order',
    required: false,
    schema: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    description: 'The order to return results',
    example: [['field_name', 'ASC']]
  }
];

export function ApiDoc({
  path,
  modelName,
  routes = defaultRoutes,
  options = {}
}) {
  const opts = Object.assign({ isPublic: false }, options);
  const docs = {};

  const singleRecordResponse = {
    200: {
      description: 'Successful Request',
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${modelName}` }
        }
      }
    }
  };

  const multiRecordResponse = {
    200: {
      description: 'Successful Request',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              records: {
                type: 'array',
                items: { $ref: `#/components/schemas/${modelName}` }
              },
              totalRecords: {
                type: 'number'
              }
            }
          }
        }
      }
    }
  };

  if (routes.includes('count')) {
    docs[`/${path}/count`] = {
      get: {
        tags: [modelNamepath],
        summary: `Count number of ${path}`,
        parameters: apiQueryParameters,
        responses: {
          200: {
            description: 'Successful Request',
            content: {
              schema: {
                type: 'object',
                properties: {
                  totalRecords: {
                    type: 'number'
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  if (routes.includes('describe')) {
    docs[`/${path}/describe`] = {
      get: {
        tags: [modelName],
        summary: `Describes ${path}`,
        responses: {}
      }
    };
  }

  if (routes.includes('index')) {
    docs[`/${path}`] = docs[`/${path}`] || {};
    docs[`/${path}`].get = {
      tags: [modelName],
      summary: `Gets a list of ${path}`,
      parameters: apiQueryParameters,
      responses: multiRecordResponse
    };
  }

  if (routes.includes('create')) {
    docs[`/${path}`] = docs[`/${path}`] || {};
    docs[`/${path}`].post = {
      tags: [modelName],
      summary: `Creates ${path}`,
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'order placed for purchasing the pet',
          required: true,
          schema: { $ref: `#/components/schemas/${modelName}` }
        }
      ],
      responses: singleRecordResponse
    };
  }

  if (routes.includes('read')) {
    docs[`/${path}/:id`] = docs[`/${path}/:id`] || {};
    docs[`/${path}/:id`].get = {
      tags: [modelName],
      summary: `Gets ${path} by their id`,
      requestBody: {},
      responses: {
        200: {
          description: 'Successful Request',
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${modelName}` }
            }
          }
        },
        404: {
          description: 'Not Found'
        },
        500: {
          description: 'Internal Server Error'
        }
      }
    };
  }

  if (routes.includes('update')) {
    docs[`/${path}/:id`] = docs[`/${path}/:id`] || {};
    docs[`/${path}/:id`].put = {
      tags: [modelName],
      summary: `Updates ${path} by their id`,
      requestBody: {},
      responses: {}
    };
  }

  if (routes.includes('delete')) {
    docs[`/${path}/:id`] = docs[`/${path}/:id`] || {};
    docs[`/${path}/:id`].get = {
      tags: [modelName],
      summary: `Deletes ${path} by their id`,
      requestBody: {},
      responses: {}
    };
  }

  if (routes.includes('related')) {
    docs[`/${path}/:id/related/:related`] =
      docs[`/${path}/:id/related/:related`] || {};
    docs[`/${path}/:id/related/:related`].get = {
      tags: [modelName],
      summary: `Gets ${path} related objects`,
      requestBody: {},
      responses: {}
    };

    router.get(`/${path}/:id/related/:related`, middleware, controller.related);
  }

  return docs;
}

export default ApiDoc;
