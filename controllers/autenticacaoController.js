const autenticacaoService = require('../services/autenticacaoService');

async function login(request, reply) {
  const { email, senha } = request.body;

  const usuario = await autenticacaoService.login(email, senha);

  return reply.code(200).send(usuario);
}

module.exports = {
  login,
};
