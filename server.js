require('dotenv').config();

//habilitar logger
const fastify = require('fastify')({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: false,
    },
  },
});

//tratamento de erros
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  const statusCode = error.statusCode || 500;

  const errorName =
    statusCode >= 500 ? 'Internal Server Error' : error.error || 'Bad Request';

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

//iniciar servidor na porta 3000
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
