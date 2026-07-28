//importa o controller responsavel pelas operações de usuarios
const usuariosController = require('../controllers/usuariosController');

//importa os schemas reponsaveis por validar as requisições da api
const {
  criarUsuarioSchema,
  buscarUsuarioPorIdSchema,
  atualizarUsuarioSchema,
} = require('../schemas/usuariosSchema');

//plugin responsavel por registrar todas as rotas de usuarios
async function usuariosRoutes(fastify) {
  //rota GET.. listar todos os usuarios
  fastify.get('/usuarios', usuariosController.listarUsuarios);

  //rota GET.. buscar um usuario por id
  fastify.get(
    '/usuarios/:id',
    { schema: buscarUsuarioPorIdSchema },
    usuariosController.buscarUsuarioPorId,
  );

  //rota POST.. criar usuario
  fastify.post(
    '/usuarios',
    { schema: criarUsuarioSchema },
    usuariosController.criarUsuario,
  );

  //rota PUT.. atualizar usuario
  fastify.put(
    '/usuarios/:id',
    { schema: atualizarUsuarioSchema },
    usuariosController.atualizarUsuario,
  );

  //rota DELETE.. excluir usuario
  fastify.delete(
    '/usuarios/:id',
    { schema: buscarUsuarioPorIdSchema },
    usuariosController.removerUsuario,
  );
}

module.exports = usuariosRoutes;
