const autenticacaoController = require('../controllers/autenticacaoController');
const { loginSchema } = require('../schemas/autenticacaoSchema');

async function autenticacaoRoutes(fastify) {
  fastify.post(
    '/login',
    {
      schema: loginSchema,
    },
    autenticacaoController.login,
  );
}

module.exports = autenticacaoRoutes;
