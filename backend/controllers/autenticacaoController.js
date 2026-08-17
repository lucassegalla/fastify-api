const autenticacaoService = require('../services/autenticacaoService');

async function login(request, reply) {
  const { email, senha } = request.body;

  const usuario = await autenticacaoService.login(email, senha);

  const token = await reply.jwtSign(
    {
      id: usuario.id,
      role: usuario.role,
    },
    {
      expiresIn: '1h',
    },
  );

  return reply.code(200).send({ token });
}

module.exports = {
  login,
};
