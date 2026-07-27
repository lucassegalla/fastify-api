const usuariosController = require('../controllers/usuariosController');

async function usuariosRoutes(fastify, options) {
  fastify.get('/usuarios', usuariosController.listarUsuarios);
}

module.exports = usuariosRoutes;
