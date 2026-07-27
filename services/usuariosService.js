const usuarios = require('../data/usuarios');

function listarUsuarios() {
  return usuarios;
}

module.exports = {
  listarUsuarios,
};
