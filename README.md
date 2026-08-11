# Fastify API Basics

API REST desenvolvida com foco em arquitetura em camadas, validação de dados, segurança, testes automatizados, containerização e deploy em cloud.

## Objetivo

Projeto criado com o objetivo de estudar os fundamentos do Node.js, aprofundar os conhecimentos em desenvolvimento backend e demonstrar a evolução na construção de uma API REST seguindo boas práticas de arquitetura, organização em camadas e desenvolvimento de software, também servindo como uma referência prática para consultas futuras.

## Tecnologias Utilizadas

- **JavaScript** - Linguagem utilizada no desenvolvimento da aplicação
- **Node.js 24** - Ambiente de execução JavaScript
- **Fastify** - Framework para construção da API REST
- **PostgreSQL 18** - Sistema de gerenciamento de banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash e verificação segura de senhas
- **OpenAPI (Swagger)** - Documentação automática da API
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração dos containers da API e dos bancos de dados
- **GitHub Actions** - Integração contínua e execução automatizada dos testes
- **Render** - Ambiente de deploy em cloud com integração contínua
- **Amazon ECR** - Registro de imagens Docker
- **Amazon ECS com AWS Fargate** - Execução da aplicação containerizada na AWS
- **Amazon RDS** - Banco PostgreSQL gerenciado na AWS
- **AWS Systems Manager Parameter Store** - Armazenamento seguro de credenciais e secrets
- **Amazon CloudWatch** - Centralização dos logs da aplicação executada no ECS

## Arquitetura

A aplicação foi desenvolvida seguindo uma arquitetura em camadas, cada uma possuindo sua responsabilidade específica, facilitando manutenção, testes e evolução do projeto.

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
├── .github/
│   └── workflows/
│       └── ci.yml
├── config/
├── controllers/
├── database/
│   ├── connection.js
│   ├── init/
│   │   └── 01-create-usuarios.sql
│   ├── migrations/
│   │   └── 001-create-usuarios.sql
│   └── migrate.js
├── errors/
├── middlewares/
├── repositories/
├── routes/
├── schemas/
├── services/
├── tests/
│   ├── helpers/
│   └── integration/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── app.js
├── package.json
├── package-lock.json
├── README.md
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
- Migrations para gerenciamento da estrutura do banco
- Suporte a conexão PostgreSQL com SSL/TLS
- Integração contínua com GitHub Actions
- Containerização com Docker
- Deploy em múltiplos ambientes de cloud

## Como executar

A aplicação pode ser executada utilizando Docker ou diretamente no ambiente local.

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
DB_SSL=false
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

#### 5. Executar migrations

As migrations podem ser executadas dentro do ambiente Docker com:

```bash
docker compose run --rm api npm run migrate
```

#### 6. Encerrar os containers

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

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SSL=false
JWT_SECRET=sua_chave_secreta
```

#### 4. Executar migrations

```bash
npm run migrate
```

#### 5. Iniciar a aplicação

```bash
npm start
```

## Migrations

O projeto possui um mecanismo de migrations para criar e evoluir a estrutura do banco de dados independentemente do ambiente onde o PostgreSQL está sendo executado.

As migrations ficam armazenadas em:

```text
database/migrations/
```

Atualmente:

```text
001-create-usuarios.sql
```

O script responsável pela execução está em:

```text
database/migrate.js
```

Para executar as migrations:

```bash
npm run migrate
```

Em Docker:

```bash
docker compose run --rm api npm run migrate
```

Esse mecanismo permite utilizar a mesma definição de estrutura do banco em diferentes ambientes, incluindo PostgreSQL local, Docker e Amazon RDS.

## Testes Automatizados

O projeto possui testes de integração utilizando o módulo nativo `node:test` e o método `fastify.inject()`, permitindo validar o comportamento da API sem a necessidade de iniciar um servidor HTTP.

Os testes utilizam um banco de dados separado do ambiente de desenvolvimento para garantir o isolamento dos dados.

### Executando os testes com Docker

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
DB_SSL=false
JWT_SECRET=sua_chave_secreta_de_teste
```

Certifique-se de que o banco de testes esteja disponível e execute:

```bash
npm test
```

## Integração Contínua

O projeto utiliza GitHub Actions para executar automaticamente os testes de integração e validar alterações no código.

O workflow de CI é executado nos seguintes eventos:

- Push para a branch `main`
- Pull request direcionado para a branch `main`

O ambiente de CI utiliza Node.js 24 e PostgreSQL 18.

Durante a execução, o GitHub Actions:

1. Prepara um ambiente Ubuntu
2. Configura o Node.js
3. Instala as dependências do projeto
4. Inicializa um banco PostgreSQL exclusivo para testes
5. Cria a estrutura necessária do banco de dados
6. Executa a suíte de testes automatizados

Caso algum teste falhe, o workflow é marcado como falho, permitindo identificar problemas antes que novas alterações sejam integradas ao projeto.

## Deploy

O projeto possui ambientes de deploy utilizando Render e Amazon Web Services (AWS).

### Render

A aplicação está publicada no Render utilizando Docker, com um banco de dados PostgreSQL gerenciado na mesma plataforma.

A API está disponível publicamente em:

https://fastify-api-basics.onrender.com

A infraestrutura é composta por:

- Web Service responsável pela execução da API
- Imagem Docker construída a partir do `Dockerfile`
- Banco PostgreSQL gerenciado pelo Render
- Variáveis de ambiente configuradas diretamente na plataforma

### Deploy contínuo no Render

O deploy da aplicação é realizado automaticamente pelo Render após a conclusão bem-sucedida dos checks de CI executados pelo GitHub Actions.

O fluxo segue:

```text
Push para main
      |
      ▼
GitHub Actions
      |
      ▼
Testes automatizados
      |
      ▼
Render
      |
      ▼
Deploy
```

Caso os testes falhem, o deploy não é iniciado.

## Deploy na AWS

A aplicação também possui um ambiente implantado na AWS utilizando serviços gerenciados e containers.

A arquitetura utilizada é:

```text
                    Amazon ECR
                        |
                        | imagem Docker
                        ▼
Internet ───────► Amazon ECS / Fargate
                        |
                        | SSL/TLS
                        ▼
                 Amazon RDS
                 PostgreSQL 18

Parameter Store ──────► ECS
 DB_PASSWORD
 JWT_SECRET

ECS ─────────────────► CloudWatch Logs
```

### Amazon ECR

O Amazon Elastic Container Registry armazena a imagem Docker utilizada para executar a aplicação no ECS.

### Amazon ECS e AWS Fargate

A API é executada como um container através do Amazon ECS utilizando AWS Fargate, eliminando a necessidade de administrar diretamente servidores ou instâncias EC2.

O ECS Service mantém a quantidade desejada de tasks da aplicação em execução.

### Amazon RDS

O banco de dados do ambiente AWS utiliza PostgreSQL 18 através do Amazon RDS.

A comunicação entre a aplicação e o banco ocorre utilizando SSL/TLS:

```env
DB_SSL=true
```

O acesso ao banco é controlado através de Security Groups.

### Parameter Store

Informações sensíveis não são armazenadas diretamente na imagem Docker ou na Task Definition.

Os seguintes valores são armazenados como `SecureString` no AWS Systems Manager Parameter Store:

```text
DB_PASSWORD
JWT_SECRET
```

O ECS obtém esses valores durante a inicialização da task através da Task Execution Role.

### CloudWatch

Os logs dos containers executados pelo ECS são enviados para o Amazon CloudWatch, permitindo acompanhar requisições, inicialização da aplicação e erros ocorridos no ambiente AWS.

### Migrations na AWS

A estrutura do banco no RDS pode ser inicializada utilizando o mesmo sistema de migrations utilizado localmente.

Uma task temporária do ECS executa:

```bash
npm run migrate
```

Essa task conecta-se ao RDS, executa as migrations pendentes e encerra sua execução.

Atualmente esse processo é executado manualmente durante alterações na estrutura do banco.

## Documentação da API

Após iniciar a aplicação localmente, a documentação interativa estará disponível em:

```text
http://localhost:3000/docs
```

A documentação da versão publicada no Render está disponível em:

```text
https://fastify-api-basics.onrender.com/docs
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
- [x] CI com GitHub Actions
- [x] Deploy em cloud com Render
- [x] CD com Render
- [x] Deploy em cloud com AWS

### Próximos passos

- [ ] Automatizar o deploy na AWS
- [ ] Automatizar migrations durante o processo de deploy
- [ ] Frontend para demonstração

## Autor

Desenvolvido por **Lucas Wallace Segalla**

- GitHub: https://github.com/lucassegalla
- LinkedIn: https://linkedin.com/in/lucassegalla
