const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');
const fp = require('fastify-plugin');

async function configurarSwagger(fastify) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Fastify API Basics',
        description:
          'API REST desenvolvida para estudos com Node.js, Fastify e PostgreSQL.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });
}

module.exports = fp(configurarSwagger);
