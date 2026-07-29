const usuarioPorIdSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
      },
    },
  },
};

const criarUsuarioSchema = {
  body: {
    type: 'object',
    required: ['nome', 'idade'],
    properties: {
      nome: {
        type: 'string',
        minLength: 3,
      },
      idade: {
        type: 'integer',
        minimum: 0,
      },
    },
  },
};

const atualizarUsuarioSchema = {
  params: usuarioPorIdSchema.params,
  body: criarUsuarioSchema.body,
};

module.exports = {
  criarUsuarioSchema,
  usuarioPorIdSchema,
  atualizarUsuarioSchema,
};
