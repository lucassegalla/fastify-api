const autenticacaoController = require('../controllers/autenticacaoController');

async function autenticacaoRoutes(fastify) {
  fastify.post('/login', autenticacaoController.login);
}

module.exports = autenticacaoRoutes;
