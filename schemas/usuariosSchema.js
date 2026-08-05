//SCHEMAS REUTILIZÁVEIS

const usuarioSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'nome', 'email', 'idade'],
  properties: {
    id: {
      type: 'integer',
      description: 'Identificador do usuário',
    },
    nome: {
      type: 'string',
      description: 'Nome do usuário',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Email do usuário',
    },
    idade: {
      type: 'integer',
      description: 'Idade do usuário',
    },
  },
};

const usuarioCriacaoBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['nome', 'email', 'senha', 'idade'],
  properties: {
    nome: {
      type: 'string',
      minLength: 3,
      description: 'Nome do usuário',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'E-mail do usuário',
    },
    senha: {
      type: 'string',
      minLength: 6,
      description: 'Senha do usuário',
    },
    idade: {
      type: 'integer',
      minimum: 0,
      description: 'Idade do usuário',
    },
  },
};

const usuarioAtualizacaoBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['nome', 'email', 'idade'],
  properties: {
    nome: {
      type: 'string',
      minLength: 3,
      description: 'Nome do usuário',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'E-mail do usuário',
    },
    idade: {
      type: 'integer',
      minimum: 0,
      description: 'Idade do usuário',
    },
  },
};

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

const usuarioIdParamsSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: {
      type: 'integer',
      minimum: 1,
      description: 'ID do usuário',
    },
  },
};

const paginacaoUsuariosSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['dados', 'paginacao'],
  properties: {
    dados: {
      type: 'array',
      description: 'Lista de usuários da página atual',
      items: usuarioSchema,
    },
    paginacao: {
      type: 'object',
      additionalProperties: false,
      required: ['paginaAtual', 'limite', 'totalUsuarios', 'totalPaginas'],
      properties: {
        paginaAtual: {
          type: 'integer',
          minimum: 1,
          description: 'Página atual',
        },
        limite: {
          type: 'integer',
          minimum: 1,
          description: 'Quantidade máxima de usuários por página',
        },
        totalUsuarios: {
          type: 'integer',
          minimum: 0,
          description: 'Quantidade total de usuários',
        },
        totalPaginas: {
          type: 'integer',
          minimum: 0,
          description: 'Quantidade total de páginas',
        },
      },
    },
  },
};

//SCHEMAS DAS ROTAS

const listarUsuariosSchema = {
  summary: 'Listar usuários',
  description: 'Retorna uma lista paginada de usuários',
  tags: ['Usuários'],
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        description: 'Número da página',
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'Quantidade máxima de usuários por página',
      },
    },
  },
  response: {
    200: paginacaoUsuariosSchema,
    400: errorSchema,
  },
};

const buscarUsuarioPorIdSchema = {
  summary: 'Buscar usuário por ID',
  description: 'Retorna um usuário a partir do seu identificador',
  tags: ['Usuários'],
  params: usuarioIdParamsSchema,
  response: {
    200: usuarioSchema,
    404: errorSchema,
  },
};

const criarUsuarioSchema = {
  summary: 'Criar usuário',
  description: 'Cria um novo usuário',
  tags: ['Usuários'],
  body: usuarioCriacaoBodySchema,
  response: {
    201: usuarioSchema,
    400: errorSchema,
  },
};

const atualizarUsuarioSchema = {
  summary: 'Atualizar usuário',
  description: 'Atualiza os dados de um usuário existente',
  tags: ['Usuários'],
  params: usuarioIdParamsSchema,
  body: usuarioAtualizacaoBodySchema,
  response: {
    200: usuarioSchema,
    400: errorSchema,
    404: errorSchema,
  },
};

const removerUsuarioPorIdSchema = {
  summary: 'Remover usuário',
  description: 'Remove um usuário a partir do seu identificador',
  tags: ['Usuários'],
  params: usuarioIdParamsSchema,
  response: {
    204: {
      type: 'null',
      description: 'Usuário removido com sucesso',
    },
    404: errorSchema,
  },
};

module.exports = {
  listarUsuariosSchema,
  buscarUsuarioPorIdSchema,
  criarUsuarioSchema,
  atualizarUsuarioSchema,
  removerUsuarioPorIdSchema,
};
