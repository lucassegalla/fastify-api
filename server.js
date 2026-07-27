const fastify = require('fastify')({
  logger: true,
});

//fastify.register(require('@fastify/formbody'));

const usuariosRoutes = require('./routes/usuarios');
fastify.register(usuariosRoutes);

fastify.get('/', async (request, reply) => {
  return { mensagem: 'teste fastify' };
});

//iniciar servidor na porta 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });

    console.log('servidor iniciado');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
