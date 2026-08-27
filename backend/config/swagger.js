const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');
const fp = require('fastify-plugin');

async function configurarSwagger(fastify) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Fastify API',
        description:
          'API REST desenvolvida com Node.js, Fastify e PostgreSQL, com autenticação JWT, autorização por perfil e operações CRUD de usuários.',
        version: '1.0.0',
      },

      tags: [
        {
          name: 'Autenticação',
          description: 'Operações relacionadas à autenticação de usuários',
        },
        {
          name: 'Usuários',
          description: 'Operações relacionadas ao gerenciamento de usuários',
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
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });
}

module.exports = fp(configurarSwagger);
