const usuariosService = require('../services/usuariosService');

async function listarUsuarios(request, reply) {
  const usuarios = usuariosService.listarUsuarios();

  return usuarios;
}

module.exports = {
  listarUsuarios,
};
