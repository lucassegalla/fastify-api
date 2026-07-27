const usuariosService = require('../services/usuariosService');

async function listarUsuarios(request, reply) {
  const usuarios = usuariosService.listarUsuarios();

  return usuarios;
}

async function criarUsuario(request, reply) {
  const usuario = request.body;

  const novoUsuario = usuariosService.criarUsuario(usuario);

  reply.code(201);

  return novoUsuario;
}

async function buscarUsuarioPorId(request, reply) {
  const id = Number(request.params.id);

  const usuario = usuariosService.buscarUsuarioPorId(id);

  if (!usuario) {
    reply.code(404);

    return {
      mensagem: 'usuario nao encontrado',
    };
  }

  return usuario;
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioPorId,
};
