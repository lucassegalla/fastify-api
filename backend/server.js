const construirApp = require('./app');

const app = construirApp();

async function iniciarServidor() {
  try {
    await app.listen({
      port: process.env.PORT,
      host: '0.0.0.0',
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

iniciarServidor();
