const listarUsuariosSchema = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
      },
    },
  },
};

const usuarioPorIdSchema = {
  params: {
    type: 'object',
    additionalProperties: false,
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
    additionalProperties: false,
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
  listarUsuariosSchema,
  criarUsuarioSchema,
  usuarioPorIdSchema,
  atualizarUsuarioSchema,
};
