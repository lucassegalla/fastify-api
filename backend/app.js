const configurarSwagger = require('./config/swagger');
const jwt = require('@fastify/jwt');
const cors = require('@fastify/cors');

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

function construirApp(options = {}) {
  const fastify = require('fastify')({
    logger: options.logger ?? true,
    ajv: {
      customOptions: {
        removeAdditional: false,
      },
    },
  });

  fastify.register(cors, {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  fastify.register(configurarSwagger);

  const nomeErros = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
  };

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    const statusCode = error.statusCode || 500;

    const errorName =
      statusCode >= 500
        ? 'Internal Server Error'
        : error.error || nomeErros[statusCode] || 'Bad Request';

    const message =
      statusCode >= 500 ? 'Erro interno do servidor' : error.message;

    return reply.code(statusCode).send({
      statusCode,
      error: errorName,
      message,
    });
  });

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
  });

  const usuariosRoutes = require('./routes/usuarios');
  fastify.register(usuariosRoutes);

  const autenticacaoRoutes = require('./routes/autenticacao');
  fastify.register(autenticacaoRoutes);

  fastify.get('/', async () => {
    return { mensagem: 'API funcionando' };
  });

  return fastify;
}

module.exports = construirApp;
