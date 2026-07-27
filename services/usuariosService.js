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

//exportar funções
module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioPorId,
};
