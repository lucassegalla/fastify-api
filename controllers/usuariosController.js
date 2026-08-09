const usuariosService = require('../services/usuariosService');

async function listarUsuarios(request, reply) {
  const query = request.query;
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  const usuarios = await usuariosService.listarUsuarios(page, limit);

  return reply.code(200).send(usuarios);
}

async function criarUsuario(request, reply) {
  const usuario = request.body;

  const novoUsuario = await usuariosService.criarUsuario(usuario);

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
  const dadosAtualizados = request.body;

  const usuarioAtualizado = await usuariosService.atualizarUsuario(
    id,
    dadosAtualizados,
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
