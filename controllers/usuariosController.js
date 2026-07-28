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

async function atualizarUsuario(request, reply) {
  const id = request.params.id;
  const dadosAtualizados = request.body;

  const usuarioAtualizado = usuariosService.atualizarUsuario(
    Number(id),
    dadosAtualizados,
  );

  if (!usuarioAtualizado) {
    reply.code(404);

    return {
      mensagem: 'usuario não encontrado',
    };
  }

  return usuarioAtualizado;
}

async function removerUsuario(request, reply) {
  const id = Number(request.params.id);

  const removido = usuariosService.removerUsuario(id);

  if (!removido) {
    return reply.code(404).send({
      mensagem: 'Usuario não encontrado',
    });
  }

  return reply.code(204).send();
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  removerUsuario,
};
