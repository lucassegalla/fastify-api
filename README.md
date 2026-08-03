# Fastify API Basics

API REST desenvolvida com foco em arquitetura em camadas, validação de dados e boas práticas de desenvolvimento backend.

## Objetivo

Projeto criado com o objetivo de estudar os fundamentos do Node.js, aprofundar os conhecimentos em desenvolvimento backend e demonstrar a evolução na construção de uma API REST seguindo boas práticas de arquitetura, organização em camadas e desenvolvimento de software, também servindo como uma referência prática para consultas futuras.

## Tecnologias Utilizadas

- **JavaScript**
- **Node.js** - Ambiente de execução JavaScript.
- **Fastify** - Framework para construção da API REST.
- **PostgreSQL** - Sistema de gerenciamento de banco de dados relacional.

## Arquitetura

Aplicação desenvolvida seguindo uma arquitetura em camadas, cada uma possuindo sua responsabilidade específica, facilitando manutenção, testes e evolução do projeto.

```text
Cliente HTTP
    |
    ▼
Fastify
    |
    ▼
Controller
    |
    ▼
Service
    |
    ▼
Repository
    |
    ▼
PostgreSQL
```

### Fastify

Framework responsável por receber as requisições HTTP, realizar o roteamento, executar as validações definidas pelos JSON Schemas e encaminhar a requisição para o Controller correspondente.

### Controller

Recebe as requisições HTTP, extrai os dados da requisição, delega o processamento para a camada de Service e retorna a resposta ao cliente.

### Service

Implementa as regras de negócio da aplicação, realiza validações complementares, trata os dados antes da persistência e coordena a comunicação com a camada de Repository.

### Repository

Centraliza o acesso ao banco de dados, executando consultas SQL e abstraindo a camada de persistência da aplicação.

### PostgreSQL

Sistema de gerenciamento de banco de dados relacional utilizado para armazenar e gerenciar os dados da aplicação de forma persistente.

## Estrutura do Projeto

```text
.
├── controllers/
├── database/
├── errors/
├── repositories/
├── routes/
├── schemas/
├── services/
├── app.js
└── server.js
```

## Funcionalidades

### Gerenciamento de usuários

- Criar usuários
- Listar usuários
- Buscar usuários por ID
- Atualizar usuários
- Remover usuários

### Recursos da API

- Paginação de resultados
- Validação de requisições com JSON Schema
- Tratamento centralizado de erros
- Normalização de dados antes da persistência

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/lucassegalla/fastify-api-basics.git
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

### 4. Iniciar a aplicação

```bash
npm start
```

## Endpoints

## Endpoints

| Método   | Endpoint        | Status | Descrição                          |
| :------- | :-------------- | :----: | :--------------------------------- |
| `GET`    | `/`             | `200`  | Verifica se a API está em execução |
| `GET`    | `/usuarios`     | `200`  | Lista os usuários cadastrados      |
| `GET`    | `/usuarios/:id` | `200`  | Busca um usuário pelo ID           |
| `POST`   | `/usuarios`     | `201`  | Cria um novo usuário               |
| `PUT`    | `/usuarios/:id` | `200`  | Atualiza um usuário existente      |
| `DELETE` | `/usuarios/:id` | `204`  | Remove um usuário                  |

## Roadmap

### Concluído

- [x] Estrutura inicial da API
- [x] CRUD de usuários
- [x] Integração com PostgreSQL
- [x] Arquitetura em camadas
- [x] Repository Pattern
- [x] Tratamento centralizado de erros
- [x] Validação com JSON Schema
- [x] Paginação

### Próximos passos

- [ ] Testes automatizados
- [ ] Documentação da API (Swagger/OpenAPI)
- [ ] Autenticação e autorização (JWT)
- [ ] Docker
- [ ] Docker Compose
- [ ] CI/CD
- [ ] Deploy em Cloud
- [ ] Frontend para demonstração

## Autor

Desenvolvido por **Lucas Wallace Segalla**

- GitHub: https://github.com/lucassegalla
- LinkedIn: https://linkedin.com/in/lucassegalla
