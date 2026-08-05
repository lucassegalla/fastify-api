const bcrypt = require('bcrypt');
const usuariosRepository = require('../repositories/usuariosRepository');
const UnauthorizedError = require('../errors/UnauthorizedError');

async function login(email, senha) {
  const usuario = await usuariosRepository.buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new UnauthorizedError('Credenciais inválidas');
  }

  console.log({
    senha,
    tipoSenha: typeof senha,
    senhaHash: usuario.senha_hash,
    tipoSenhaHash: typeof usuario.senha_hash,
  });

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaCorreta) {
    throw new UnauthorizedError('Credenciais inválidas');
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    idade: usuario.idade,
  };
}

module.exports = {
  login,
};
