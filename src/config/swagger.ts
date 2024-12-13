import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Monitro API Documentation',
      version,
      description: 'API documentation for MontPro SaaS platform',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        url: 'https://montpro.com/support',
        email: 'support@montpro.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local Development Server',
      },
      {
        url: 'https://api.montpro.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  themes: [
    {
      name: 'dark',
      customCss: `
        body { background-color: #1a1a1a; color: #f0f0f0; }
        .swagger-ui .opblock-tag { color: #f0f0f0; }
        .swagger-ui .opblock .opblock-summary-operation-id, .swagger-ui .opblock .opblock-summary-path { color: #f0f0f0; }
        .swagger-ui .opblock .opblock-summary-description { color: #bbb; }
        .swagger-ui .info .title { color: #f0f0f0; }
        .swagger-ui .scheme-container { background-color: #2a2a2a; }
      `,
    },
  ],
  apis: [
    './src/routes/v1/**/*.ts',
    './src/models/*.ts',
    './src/interfaces/*.ts',
    
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
