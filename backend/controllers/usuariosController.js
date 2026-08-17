const usuariosService = require('../services/usuariosService');

async function listarUsuarios(request, reply) {
  const page = Number(request.query.page ?? 1);
  const limit = Number(request.query.limit ?? 10);

  const usuarios = await usuariosService.listarUsuarios(page, limit);

  return reply.code(200).send(usuarios);
}

async function criarUsuario(request, reply) {
  const novoUsuario = await usuariosService.criarUsuario(request.body);

  return reply.code(201).send(novoUsuario);
}

async function buscarUsuarioPorId(request, reply) {
  const id = Number(request.params.id);

  const usuario = await usuariosService.buscarUsuarioAutorizado(
    id,
    request.user,
  );

  return reply.code(200).send(usuario);
}

async function atualizarUsuario(request, reply) {
  const id = Number(request.params.id);

  const usuarioAtualizado = await usuariosService.atualizarUsuario(
    id,
    request.body,
    request.user,
  );

  return reply.code(200).send(usuarioAtualizado);
}

async function removerUsuario(request, reply) {
  const id = Number(request.params.id);

  await usuariosService.removerUsuario(id, request.user);

  return reply.code(204).send();
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  removerUsuario,
};
