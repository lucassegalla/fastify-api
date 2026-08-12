# Fastify API Basics

API REST desenvolvida com Node.js, Fastify e PostgreSQL, com foco em fundamentos de backend, organização em camadas, segurança, testes, containerização e deploy em cloud.

## Objetivo

Este projeto começou como uma API CRUD para praticar os fundamentos do Node.js e foi evoluindo conforme novos conceitos de backend foram sendo estudados.

Além das operações básicas da API, o projeto passou a incluir autenticação, autorização, testes de integração, documentação, Docker, migrations e um fluxo de CI/CD com deploy em Render e AWS. A ideia é manter o repositório como referência prática para estudos futuros.

## Tecnologias utilizadas

- **JavaScript** - Linguagem utilizada na aplicação
- **Node.js** - Ambiente de execução JavaScript
- **Fastify** - Framework utilizado para construir a API REST
- **PostgreSQL** - Banco de dados relacional
- **pg** - Driver utilizado para comunicação com PostgreSQL
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash e verificação de senhas
- **JSON Schema** - Validação das requisições e respostas
- **OpenAPI / Swagger** - Documentação interativa da API
- **node:test** - Testes automatizados de integração
- **Docker** - Containerização da aplicação
- **Docker Compose** - Ambiente local e banco isolado para testes
- **GitHub Actions** - CI/CD do projeto
- **Render** - Ambiente de deploy em cloud
- **Amazon ECR** - Registro das imagens Docker na AWS
- **Amazon ECS + AWS Fargate** - Execução da API containerizada na AWS
- **Application Load Balancer (ALB)** - Ponto de entrada público e distribuição do tráfego para as tasks da aplicação
- **Amazon RDS** - PostgreSQL gerenciado na AWS
- **AWS Systems Manager Parameter Store** - Armazenamento de secrets utilizados pelas tasks
- **Amazon CloudWatch** - Logs dos containers executados no ECS
- **AWS IAM, STS e OIDC** - Autenticação do GitHub Actions na AWS utilizando credenciais temporárias

## Arquitetura

A aplicação foi organizada em camadas para separar as responsabilidades e evitar que regras de negócio, acesso ao banco e tratamento HTTP fiquem misturados.

### Routes

Definem os endpoints da API, os schemas utilizados em cada rota e os middlewares necessários.

### Controllers

Recebem as requisições HTTP, extraem os dados necessários e encaminham o processamento para os services.

### Services

Concentram as regras de negócio da aplicação, como normalização de dados, hash de senha, autorização e tratamento de usuários inexistentes.

### Repositories

Centralizam as consultas SQL e o acesso ao PostgreSQL.

### Schemas

Definem a validação das entradas e respostas da API utilizando JSON Schema. Esses mesmos schemas também são utilizados para gerar a documentação OpenAPI.

## Estrutura do projeto

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
│   ├── migrations/
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

### Usuários

- Criação de usuários
- Listagem paginada
- Busca por ID
- Atualização de dados
- Remoção de usuários
- Normalização do nome antes da persistência
- Senhas armazenadas utilizando hash com bcrypt

### Autenticação e autorização

O login é realizado com e-mail e senha e retorna um token JWT com validade de uma hora.

As rotas protegidas utilizam o token para identificar o usuário autenticado. Usuários comuns podem consultar, atualizar e remover a própria conta, enquanto usuários com role `admin` podem executar essas operações sobre qualquer usuário.

### Validação e erros

As entradas da API são validadas com JSON Schema. O projeto também possui um tratamento centralizado de erros para padronizar respostas como `400`, `401`, `403`, `404` e `500`.

### Paginação

A listagem de usuários aceita os parâmetros `page` e `limit`.

Quando não informados, são utilizados os valores padrão:

```text
page=1
limit=10
```

O limite máximo por página é `100`.

## Como executar

A aplicação pode ser executada com Docker ou diretamente no ambiente local.

### Docker

#### 1. Clonar o repositório

```bash
git clone https://github.com/lucassegalla/fastify-api-basics.git
cd fastify-api-basics
```

#### 2. Configurar as variáveis de ambiente

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

#### 3. Iniciar a aplicação

```bash
docker compose up --build
```

A API ficará disponível em:

```text
http://localhost:3000
```

A documentação Swagger ficará disponível em:

```text
http://localhost:3000/docs
```

#### 4. Executar migrations

```bash
docker compose run --rm api npm run migrate
```

#### 5. Encerrar os containers

```bash
docker compose down
```

### Ambiente local

Para executar sem Docker, é necessário ter Node.js e PostgreSQL disponíveis no ambiente.

#### 1. Instalar as dependências

```bash
npm install
```

#### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fastify_api
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_SSL=false
JWT_SECRET=sua_chave_secreta
```

#### 3. Executar as migrations

```bash
npm run migrate
```

#### 4. Iniciar a aplicação

```bash
npm start
```

## Migrations

As alterações na estrutura do banco ficam em `database/migrations/` e são executadas pelo script `database/migrate.js`.

Atualmente o projeto possui a migration:

```text
001-create-usuarios.sql
```

O próprio banco mantém uma tabela chamada `_migrations`, utilizada para registrar quais migrations já foram aplicadas. Assim, ao executar o comando novamente, apenas migrations pendentes são processadas.

Cada migration é executada dentro de uma transação. Se alguma etapa falhar, o `ROLLBACK` é realizado e a migration não é registrada como concluída.

Para executar:

```bash
npm run migrate
```

Com Docker:

```bash
docker compose run --rm api npm run migrate
```

O mesmo mecanismo é utilizado no ambiente AWS antes de uma nova versão da API ser implantada.

## Testes automatizados

Os testes de integração utilizam o módulo nativo `node:test` junto com `fastify.inject()`. Isso permite testar as rotas da API sem precisar iniciar um servidor HTTP separado.

O projeto possui atualmente **24 testes de integração**, cobrindo operações CRUD, paginação, autenticação, autorização e cenários de erro.

Os testes utilizam um banco PostgreSQL separado do ambiente de desenvolvimento.

### Executar com Docker

```bash
docker compose run --rm test
```

O Docker Compose inicia o PostgreSQL de testes, aguarda o banco ficar disponível e executa a suíte em um container separado.

### Executar localmente

Crie um arquivo `.env.test`:

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

Depois execute:

```bash
npm test
```

## CI/CD

O projeto utiliza GitHub Actions para validar alterações e automatizar o deploy na AWS.

Em pushes e pull requests para a branch `main`, o workflow prepara um ambiente com Node.js 24 e PostgreSQL 18, instala as dependências e executa os testes de integração.

Em pushes para `main`, depois que os testes passam, o mesmo workflow continua com o deploy na AWS. A autenticação é feita por OIDC, permitindo que o GitHub Actions assuma uma IAM Role e receba credenciais temporárias do AWS STS sem armazenar Access Keys permanentes no repositório.

O deploy realiza o build da imagem Docker, publica a imagem no Amazon ECR, executa as migrations e atualiza o serviço da aplicação no ECS. O workflow também aguarda a estabilização do serviço antes de encerrar.

Se os testes ou a task de migration falharem, o deploy da nova versão não continua.

## Deploy

O projeto possui ambientes publicados no Render e na AWS.

### Render

A aplicação está publicada no Render utilizando Docker e um banco PostgreSQL gerenciado pela plataforma.

API:

https://fastify-api-basics.onrender.com

Documentação:

https://fastify-api-basics.onrender.com/docs

O deploy no Render é integrado ao repositório e ocorre após os checks configurados para o projeto serem concluídos com sucesso.

### AWS

O segundo ambiente utiliza serviços da AWS para separar melhor as responsabilidades da infraestrutura.

A imagem Docker é armazenada no **Amazon ECR** e executada pelo **Amazon ECS** utilizando **AWS Fargate**. O banco PostgreSQL fica no **Amazon RDS** e não precisa ser exposto publicamente para a aplicação acessá-lo.

A conexão com o RDS utiliza SSL/TLS através da variável:

```env
DB_SSL=true
```

Credenciais como `DB_PASSWORD` e `JWT_SECRET` ficam no **AWS Systems Manager Parameter Store** e são fornecidas às tasks durante sua inicialização. Os logs dos containers são enviados para o **Amazon CloudWatch**.

As migrations também fazem parte do deploy. Antes de atualizar a API, uma task temporária do ECS executa `npm run migrate`. O GitHub Actions aguarda o término dessa task e verifica seu código de saída. O deployment só continua quando a migration termina com sucesso.

### Application Load Balancer

O acesso público à API na AWS é feito através de um Application Load Balancer (ALB).

O ALB recebe as requisições HTTP e encaminha o tráfego para um Target Group associado ao serviço da aplicação no ECS. As tasks são registradas automaticamente nesse grupo pelo ECS, evitando que o acesso à aplicação dependa diretamente do endereço IP de uma task específica.

O Target Group também realiza verificações de integridade na rota `/` e encaminha tráfego apenas para tasks consideradas saudáveis.

A porta `3000` das tasks não fica exposta diretamente à internet. O Security Group do ECS permite nessa porta apenas o tráfego proveniente do Security Group do Load Balancer.

## Documentação da API

A documentação é gerada automaticamente com OpenAPI a partir dos schemas definidos na aplicação e disponibilizada através do Swagger UI.

Localmente:

```text
http://localhost:3000/docs
```

No Render:

```text
https://fastify-api-basics.onrender.com/docs
```

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

- [x] CRUD de usuários com PostgreSQL
- [x] Arquitetura em camadas e Repository Pattern
- [x] Validação, paginação e tratamento centralizado de erros
- [x] Autenticação e autorização com JWT
- [x] Hash de senhas com bcrypt
- [x] Documentação com Swagger/OpenAPI
- [x] Testes automatizados de integração
- [x] Docker e Docker Compose
- [x] Sistema de migrations com histórico de execução
- [x] CI com GitHub Actions
- [x] Deploy contínuo no Render
- [x] Deploy na AWS com ECR, ECS, Fargate e RDS
- [x] Deploy automatizado na AWS
- [x] Application Load Balancer na AWS

### Próximos passos

- [ ] HTTPS e domínio personalizado
- [ ] Frontend para demonstração

## Autor

Desenvolvido por **Lucas Wallace Segalla**

- GitHub: https://github.com/lucassegalla
- LinkedIn: https://linkedin.com/in/lucassegalla
