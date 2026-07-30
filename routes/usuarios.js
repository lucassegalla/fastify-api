const usuariosController = require('../controllers/usuariosController');

const {
  listarUsuariosSchema,
  criarUsuarioSchema,
  usuarioPorIdSchema,
  atualizarUsuarioSchema,
} = require('../schemas/usuariosSchema');

async function usuariosRoutes(fastify) {
  fastify.get(
    '/usuarios',
    { schema: listarUsuariosSchema },
    usuariosController.listarUsuarios,
  );

  fastify.get(
    '/usuarios/:id',
    { schema: usuarioPorIdSchema },
    usuariosController.buscarUsuarioPorId,
  );

  fastify.post(
    '/usuarios',
    { schema: criarUsuarioSchema },
    usuariosController.criarUsuario,
  );

  fastify.put(
    '/usuarios/:id',
    { schema: atualizarUsuarioSchema },
    usuariosController.atualizarUsuario,
  );

  fastify.delete(
    '/usuarios/:id',
    { schema: usuarioPorIdSchema },
    usuariosController.removerUsuario,
  );
}

module.exports = usuariosRoutes;
