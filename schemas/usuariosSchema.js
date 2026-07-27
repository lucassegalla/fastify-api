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
        type: 'number',
        minimum: 0,
      },
    },
  },
};

const buscarUsuarioPorIdSchema = {
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

module.exports = {
  criarUsuarioSchema,
  buscarUsuarioPorIdSchema,
};
