const configurarSwagger = require('./config/swagger');

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

function construirApp(options = {}) {
  //habilitar logger
  const fastify = require('fastify')({
    logger: options.logger ?? true,
    ajv: {
      customOptions: {
        removeAdditional: false,
      },
    },
  });

  fastify.register(configurarSwagger);

  //tratamento de erros
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    const statusCode = error.statusCode || 500;

    const errorName =
      statusCode >= 500
        ? 'Internal Server Error'
        : error.error || 'Bad Request';

    const message =
      statusCode >= 500 ? 'Erro interno do servidor' : error.message;

    return reply.code(statusCode).send({
      statusCode,
      error: errorName,
      message,
    });
  });

  //registro de rotas
  const usuariosRoutes = require('./routes/usuarios');
  fastify.register(usuariosRoutes);

  //rota inicial
  fastify.get('/', async (request, reply) => {
    return { mensagem: 'API funcionando' };
  });

  return fastify;
}

module.exports = construirApp;
