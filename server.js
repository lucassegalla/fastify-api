const construirApp = require('./app');
const fastify = construirApp();

//iniciar servidor na porta 3000
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT,
      host: '0.0.0.0',
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
