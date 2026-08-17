const bcrypt = require('bcrypt');
const usuariosRepository = require('../repositories/usuariosRepository');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

function normalizarNome(nome) {
  const nomeNormalizado = nome.trim();

  if (nomeNormalizado.length < 3) {
    throw new BadRequestError(
      'Nome deve possuir pelo menos 3 caracteres válidos',
    );
  }

  return nomeNormalizado;
}

function validarPermissao(idUsuario, usuarioAutenticado) {
  const usuarioAdmin = usuarioAutenticado.role === 'admin';
  const usuarioDonoConta = usuarioAutenticado.id === idUsuario;

  if (usuarioAdmin || usuarioDonoConta) {
    return;
  }

  throw new ForbiddenError('Acesso negado');
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
  const nomeNormalizado = normalizarNome(usuario.nome);
  const senhaHash = await bcrypt.hash(usuario.senha, 10);

  const dadosUsuario = {
    nome: nomeNormalizado,
    email: usuario.email,
    senha_hash: senhaHash,
    idade: usuario.idade,
  };

  return usuariosRepository.criarUsuario(dadosUsuario);
}

async function buscarUsuarioPorId(id) {
  const usuario = await usuariosRepository.buscarUsuarioPorId(id);

  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  return usuario;
}

async function buscarUsuarioAutorizado(id, usuarioAutenticado) {
  validarPermissao(id, usuarioAutenticado);

  return buscarUsuarioPorId(id);
}

async function atualizarUsuario(id, dadosAtualizados, usuarioAutenticado) {
  validarPermissao(id, usuarioAutenticado);

  await buscarUsuarioPorId(id);

  const dadosNormalizados = {
    ...dadosAtualizados,
    nome: normalizarNome(dadosAtualizados.nome),
  };

  return usuariosRepository.atualizarUsuario(id, dadosNormalizados);
}

async function removerUsuario(id, usuarioAutenticado) {
  validarPermissao(id, usuarioAutenticado);

  await buscarUsuarioPorId(id);

  await usuariosRepository.removerUsuario(id);
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioAutorizado,
  atualizarUsuario,
  removerUsuario,
};
