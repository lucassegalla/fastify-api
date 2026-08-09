const usuariosController = require('../controllers/usuariosController');
const autenticar = require('../middlewares/autenticacao');

const {
  listarUsuariosSchema,
  buscarUsuarioPorIdSchema,
  criarUsuarioSchema,
  atualizarUsuarioSchema,
  removerUsuarioPorIdSchema,
} = require('../schemas/usuariosSchema');

async function usuariosRoutes(fastify) {
  fastify.get(
    '/usuarios',
    { schema: listarUsuariosSchema, preHandler: autenticar },
    usuariosController.listarUsuarios,
  );

  fastify.get(
    '/usuarios/:id',
    { schema: buscarUsuarioPorIdSchema, preHandler: autenticar },
    usuariosController.buscarUsuarioPorId,
  );

  fastify.post(
    '/usuarios',
    { schema: criarUsuarioSchema },
    usuariosController.criarUsuario,
  );

  fastify.put(
    '/usuarios/:id',
    { schema: atualizarUsuarioSchema, preHandler: autenticar },
    usuariosController.atualizarUsuario,
  );

  fastify.delete(
    '/usuarios/:id',
    { schema: removerUsuarioPorIdSchema, preHandler: autenticar },
    usuariosController.removerUsuario,
  );
}

module.exports = usuariosRoutes;
