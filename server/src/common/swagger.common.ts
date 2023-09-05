import swaggetUi from 'swagger-ui-express';
import swaggerJs from 'swagger-jsdoc';
import { Express } from 'express';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Tennis',
      version: '0.0.1',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
      {
        url: 'https://secret.trackercracker.ru',
      },
    ],
    components: {
      securitySchemes: {
        cookieAccess: {
          description: 'Access-токен всего приложения',
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
        cookieReset: {
          description: 'Reset-токен, использующийся для восстановления пароля',
          type: 'apiKey',
          in: 'cookie',
          name: 'reset',
        },
        cookieCode: {
          description: 'Code-токен, использующийся для валидации проверочного кода',
          type: 'apiKey',
          in: 'cookie',
          name: 'code',
        },
        headerCsrf: {
          description: 'CSRF-токен всего приложения',
          type: 'apiKey',
          in: 'header',
          name: 'X-CSRF-TOKEN'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            data: {
              type: 'string',
              default: null as any
            },
            status: {
              type: 'boolean',
              default: 'false'
            },
            statusCode: {
              type: 'number',
              example: '400',
              description: 'HTTP status code'
            },
            message: {
              type: 'string',
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'BadRequest (400)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized (401)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden (403)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Not Found (404)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Conflict: {
          description: 'Conflict (409)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        TooMany: {
          description: 'Too Many Requests (429)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
      }
    },
  },
  apis: [] as string[],
};

export default (app: Express) => {
  const fileEnv = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  options.apis = [
    './src/modules/**/*.routes.' + fileEnv,
    './src/modules/**/*.entity.' + fileEnv,
    './src/modules/**/dto/*.dto.' + fileEnv,
  ];

  const spec = swaggerJs(options);
  app.use('/docs', swaggetUi.serve, swaggetUi.setup(spec));
};
