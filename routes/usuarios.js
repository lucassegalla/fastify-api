const usuariosController = require('../controllers/usuariosController');
const {
  criarUsuarioSchema,
  buscarUsuarioPorIdSchema,
} = require('../schemas/usuariosSchema');

async function usuariosRoutes(fastify, options) {
  fastify.get('/usuarios', usuariosController.listarUsuarios);

  fastify.get(
    '/usuarios/:id',
    { schema: buscarUsuarioPorIdSchema },
    usuariosController.buscarUsuarioPorId,
  );

  fastify.post(
    '/usuarios',
    { schema: criarUsuarioSchema },
    usuariosController.criarUsuario,
  );
}

module.exports = usuariosRoutes;
