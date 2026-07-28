const usuarios = require('../data/usuarios');

//listar usuarios registrados
function listarUsuarios() {
  return usuarios;
}

//criar novo usuario
function criarUsuario(usuario) {
  const novoUsuario = {
    id: usuarios.length + 1,
    ...usuario,
  };

  usuarios.push(novoUsuario);

  return novoUsuario;
}

function buscarUsuarioPorId(id) {
  return usuarios.find((usuario) => usuario.id === id);
}

function atualizarUsuario(id, dadosAtualizados) {
  const usuario = usuarios.find((usuario) => usuario.id === id);

  if (!usuario) {
    return null;
  }

  usuario.nome = dadosAtualizados.nome;
  usuario.idade = dadosAtualizados.idade;

  return usuario;
}

function removerUsuario(id) {
  const indice = usuarios.findIndex((usuario) => usuario.id === id);

  if (indice === -1) {
    return false;
  }

  usuarios.splice(indice, 1);

  return true;
}

//exportar funções
module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  removerUsuario,
};
