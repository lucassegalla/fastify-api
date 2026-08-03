const construirApp = require('./app');
const fastify = construirApp();

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
