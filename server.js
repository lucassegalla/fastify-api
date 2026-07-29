require('dotenv').config();

//habilitar logger
const fastify = require('fastify')({
  logger: true,
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
