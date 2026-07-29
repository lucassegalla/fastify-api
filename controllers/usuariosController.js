const usuariosService = require('../services/usuariosService');

async function listarUsuarios(request, reply) {
  const usuarios = await usuariosService.listarUsuarios();

  return reply.code(200).sendo(usuarios);
}

async function criarUsuario(request, reply) {
  const usuario = request.body;

  const novoUsuario = await usuariosService.criarUsuario(usuario);

  return reply.code(201).send(novoUsuario);
}

async function buscarUsuarioPorId(request, reply) {
  const id = Number(request.params.id);

  const usuario = await usuariosService.buscarUsuarioPorId(id);

  if (!usuario) {
    return reply.code(404).send({
      mensagem: 'Usuário não encontrado',
    });
  }

  return reply.code(200).send(usuario);
}

async function atualizarUsuario(request, reply) {
  const id = Number(request.params.id);
  const dadosAtualizados = request.body;

  const usuarioAtualizado = await usuariosService.atualizarUsuario(
    id,
    dadosAtualizados,
  );

  if (!usuarioAtualizado) {
    return reply.code(404).send({
      mensagem: 'Usuário não encontrado',
    });
  }

  return reply.code(200).send(usuarioAtualizado);
}

async function removerUsuario(request, reply) {
  const id = Number(request.params.id);

  const removido = await usuariosService.removerUsuario(id);

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
