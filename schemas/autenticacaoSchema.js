const errorSchema = require('./errorSchema');

const loginSchema = {
  summary: 'Autenticar usuário',
  description: 'Autentica um usuário e retorna um token JWT',
  tags: ['Autenticação'],

  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'senha'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      senha: {
        type: 'string',
        minLength: 1,
      },
    },
  },

  response: {
    200: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
      required: ['token'],
    },
    400: errorSchema,
    401: errorSchema,
  },
};

module.exports = {
  loginSchema,
};
