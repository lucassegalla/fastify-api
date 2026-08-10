# Fastify API Basics

API REST desenvolvida com foco em arquitetura em camadas, validação de dados e boas práticas de desenvolvimento backend.

## Objetivo

Projeto criado com o objetivo de estudar os fundamentos do Node.js, aprofundar os conhecimentos em desenvolvimento backend e demonstrar a evolução na construção de uma API REST seguindo boas práticas de arquitetura, organização em camadas e desenvolvimento de software, também servindo como uma referência prática para consultas futuras.

## Tecnologias Utilizadas

- **JavaScript** - Linguagem utilizada no desenvolvimento da aplicação
- **Node.js** - Ambiente de execução JavaScript
- **Fastify** - Framework para construção da API REST
- **PostgreSQL** - Sistema de gerenciamento de banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash e verificação segura de senhas
- **OpenAPI (Swagger)** - Documentação automática da API
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração dos containers da API e dos bancos de dados

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
├── config/
├── controllers/
├── database/
├── errors/
├── middlewares/
├── repositories/
├── routes/
├── schemas/
├── services/
├── tests/
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
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
- Hash de senhas com bcrypt
- Autenticação baseada em JWT
- Autorização baseada em usuário e administrador
- Documentação interativa com OpenAPI (Swagger)
- Testes automatizados de integração
- Banco de dados isolado para o ambiente de testes

## Como executar

A aplicação pode ser executada utilizando Docker ou localmente

### Docker

#### 1. Clonar o repositório

```bash
git clone https://github.com/lucassegalla/fastify-api-basics.git
```

#### 2. Instalar o Docker

Certifique-se de que o Docker e o Docker Compose estão instalados e em execução.

#### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=fastify_api
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
```

#### 4. Iniciar os containers

Execute:

```bash
docker compose up --build
```

O Docker Compose irá criar e iniciar a API e o banco de dados PostgreSQL.

A API estará disponível em:

```text
http://localhost:3000
```

#### 5. Encerrar os containers

Execute:

```bash
docker compose down
```

### Ambiente local

#### 1. Clonar o repositório

```bash
git clone https://github.com/lucassegalla/fastify-api-basics.git
```

#### 2. Instalar dependências

```bash
npm install
```

#### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente utilizadas pela aplicação:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
```

#### 4. Iniciar a aplicação

```bash
npm start
```

## Testes Automatizados

O projeto possui testes de integração utilizando o módulo nativo `node:test` e o método `fastify.inject()`, permitindo validar o comportamento da API sem a necessidade de iniciar um servidor HTTP

Os testes utilizam um banco de dados separado do ambiente de desenvolvimento para garantir o isolamento dos dados

### Executando os testes com Docker

Os testes podem ser executados em um ambiente isolado utilizando um banco PostgreSQL exclusivo para testes:

```bash
docker compose run --rm test
```

O Docker Compose inicia o banco de testes, aguarda até que ele esteja disponível e executa a suíte de testes em um container separado.

### Executando os testes localmente

Para executar os testes fora do Docker, crie um arquivo `.env.test` na raiz do projeto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fastify_api_test
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_de_teste
```

Certifique-se de que o banco de testes esteja disponível e execute:

```bash
npm test
```

## Documentação da API

Após iniciar a aplicação, a documentação interativa estará disponível em:

```text
http://localhost:3000/docs
```

A documentação é gerada automaticamente a partir dos JSON Schemas definidos na aplicação utilizando OpenAPI (Swagger).

## Endpoints

| Método   | Endpoint        | Autenticação | Status | Descrição                          |
| :------- | :-------------- | :----------: | :----: | :--------------------------------- |
| `GET`    | `/`             |     Não      | `200`  | Verifica se a API está em execução |
| `POST`   | `/login`        |     Não      | `200`  | Autentica um usuário e retorna JWT |
| `POST`   | `/usuarios`     |     Não      | `201`  | Cria um novo usuário               |
| `GET`    | `/usuarios`     |     JWT      | `200`  | Lista os usuários cadastrados      |
| `GET`    | `/usuarios/:id` |     JWT      | `200`  | Busca um usuário pelo ID           |
| `PUT`    | `/usuarios/:id` |     JWT      | `200`  | Atualiza um usuário existente      |
| `DELETE` | `/usuarios/:id` |     JWT      | `204`  | Remove um usuário                  |

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
- [x] Testes automatizados
- [x] Documentação da API (Swagger/OpenAPI)
- [x] Autenticação e autorização (JWT)
- [x] Docker
- [x] Docker Compose

### Próximos passos

- [ ] CI/CD
- [ ] Deploy em Cloud
- [ ] Frontend para demonstração

## Autor

Desenvolvido por **Lucas Wallace Segalla**

- GitHub: https://github.com/lucassegalla
- LinkedIn: https://linkedin.com/in/lucassegalla
