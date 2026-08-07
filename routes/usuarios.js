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
    {
      preHandler: autenticar,
      schema: listarUsuariosSchema,
    },
    usuariosController.listarUsuarios,
  );

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

  fastify.put(
    '/usuarios/:id',
    {
      preHandler: autenticar,
      schema: atualizarUsuarioSchema,
    },
    usuariosController.atualizarUsuario,
  );

  fastify.delete(
    '/usuarios/:id',
    {
      preHandler: autenticar,
      schema: removerUsuarioPorIdSchema,
    },
    usuariosController.removerUsuario,
  );
}

module.exports = usuariosRoutes;
