const bcrypt = require('bcrypt');
const usuariosRepository = require('../repositories/usuariosRepository');
const UnauthorizedError = require('../errors/UnauthorizedError');

async function login(email, senha) {
  const usuario = await usuariosRepository.buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new UnauthorizedError('Credenciais inválidas');
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaCorreta) {
    throw new UnauthorizedError('Credenciais inválidas');
  }

  return {
    id: usuario.id,
    role: usuario.role,
  };
}

module.exports = {
  login,
};
