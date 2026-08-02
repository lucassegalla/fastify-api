const usuariosRepository = require('../repositories/usuariosRepository');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

function normalizarNome(nome) {
  const nomeNormalizado = nome.trim();

  if (nomeNormalizado.length < 3) {
    throw new BadRequestError(
      'Nome deve possuir pelo menos 3 caracteres válidos',
    );
  }

  return nomeNormalizado;
}

async function listarUsuarios(page, limit) {
  const offset = (page - 1) * limit;

  const usuarios = await usuariosRepository.listarUsuarios(limit, offset);
  const totalUsuarios = await usuariosRepository.contarUsuarios();
  const totalPaginas = Math.ceil(totalUsuarios / limit);

  return {
    dados: usuarios,
    paginacao: {
      paginaAtual: page,
      limite: limit,
      totalUsuarios,
      totalPaginas,
    },
  };
}

async function criarUsuario(usuario) {
  const usuarioNormalizado = {
    ...usuario,
    nome: normalizarNome(usuario.nome),
  };

  const novoUsuario = await usuariosRepository.criarUsuario(usuarioNormalizado);

  return novoUsuario;
}

async function buscarUsuarioPorId(id) {
  const usuario = await usuariosRepository.buscarUsuarioPorId(id);

  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  return usuario;
}

async function atualizarUsuario(id, dadosAtualizados) {
  await buscarUsuarioPorId(id);

  const dadosNormalizado = {
    ...dadosAtualizados,
    nome: normalizarNome(dadosAtualizados.nome),
  };

  const usuarioAtualizado = await usuariosRepository.atualizarUsuario(
    id,
    dadosNormalizado,
  );

  return usuarioAtualizado;
}

async function removerUsuario(id) {
  await buscarUsuarioPorId(id);

  await usuariosRepository.removerUsuario(id);
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  removerUsuario,
};
