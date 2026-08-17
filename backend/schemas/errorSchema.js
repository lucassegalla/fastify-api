const errorSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['statusCode', 'error', 'message'],
  properties: {
    statusCode: {
      type: 'integer',
      description: 'Código HTTP da resposta',
    },
    error: {
      type: 'string',
      description: 'Nome do erro',
    },
    message: {
      type: 'string',
      description: 'Descrição do erro',
    },
  },
};

module.exports = errorSchema;
