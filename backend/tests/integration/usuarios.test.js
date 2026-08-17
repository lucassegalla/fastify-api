const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const construirApp = require('../../app');
const usuariosRepository = require('../../repositories/usuariosRepository');
const { autenticarUsuario, criarUsuario } = require('../helpers/testesHelper');

const senhaTeste = '123456';
const senhaHashTeste = 'hash_de_teste';

beforeEach(async () => {
  await usuariosRepository.limparUsuarios();
});

test('GET /health deve retornar API funcionando', async () => {
  const app = construirApp({ logger: false });

  const resposta = await app.inject({
    method: 'GET',
    url: '/health',
  });

  assert.equal(resposta.statusCode, 200);
  assert.deepEqual(JSON.parse(resposta.body), {
    mensagem: 'API funcionando',
  });

  await app.close();
});

test('GET /api/usuarios deve permitir admin listar usuários', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'admin@exemplo.com',
    senha: senhaTeste,
    idade: 25,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', senhaTeste);

  const resposta = await app.inject({
    method: 'GET',
    url: '/api/usuarios',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.ok(Array.isArray(body.dados));
  assert.ok(body.paginacao);
  assert.equal(typeof body.paginacao.paginaAtual, 'number');
  assert.equal(typeof body.paginacao.limite, 'number');
  assert.equal(typeof body.paginacao.totalUsuarios, 'number');
  assert.equal(typeof body.paginacao.totalPaginas, 'number');

  await app.close();
});

test('GET /api/usuarios não deve permitir usuário comum listar usuários', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: senhaTeste,
    idade: 25,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', senhaTeste);

  const resposta = await app.inject({
    method: 'GET',
    url: '/api/usuarios',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 403);
  assert.equal(body.error, 'Forbidden');
  assert.equal(body.message, 'Acesso permitido apenas para administradores.');

  await app.close();
});

test('GET /api/usuarios deve aplicar paginação informada para admin', async () => {
  const app = construirApp({
    logger: false,
  });

  for (let i = 1; i <= 6; i++) {
    await usuariosRepository.criarUsuario({
      nome: `Nome Exemplo ${i}`,
      email: `usuario${i}@exemplo.com`,
      senha_hash: `${senhaHashTeste}_${i}`,
      idade: 20 + i,
    });
  }

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Nome Exemplo 7',
    email: 'admin@exemplo.com',
    senha: senhaTeste,
    idade: 27,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', senhaTeste);

  const resposta = await app.inject({
    method: 'GET',
    url: '/api/usuarios?page=2&limit=5',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(body.paginacao.paginaAtual, 2);
  assert.equal(body.paginacao.limite, 5);
  assert.equal(body.paginacao.totalUsuarios, 7);
  assert.equal(body.paginacao.totalPaginas, 2);
  assert.equal(body.dados.length, 2);
  assert.equal(body.dados[0].id, 6);
  assert.equal(body.dados[1].id, 7);

  await app.close();
});

test('GET /api/usuarios deve rejeitar página inválida', async () => {
  const app = construirApp({
    logger: false,
  });

  const resposta = await app.inject({
    method: 'GET',
    url: '/api/usuarios?page=0',
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 400);
  assert.equal(body.error, 'Bad Request');

  await app.close();
});

test('POST /api/usuarios deve criar um usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const resposta = await app.inject({
    method: 'POST',
    url: '/api/usuarios',
    payload: {
      nome: 'Nome Exemplo',
      email: 'usuario@exemplo.com',
      senha: senhaTeste,
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 201);
  assert.equal(body.nome, 'Nome Exemplo');
  assert.equal(body.email, 'usuario@exemplo.com');
  assert.equal(body.idade, 25);
  assert.equal(typeof body.id, 'number');
  assert.equal(body.senha_hash, undefined);

  await app.close();
});

test('POST /api/usuarios deve criar usuário com nome normalizado', async () => {
  const app = construirApp({
    logger: false,
  });

  const resposta = await app.inject({
    method: 'POST',
    url: '/api/usuarios',
    payload: {
      nome: '    Nome Exemplo     ',
      email: 'usuario@exemplo.com',
      senha: senhaTeste,
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 201);
  assert.equal(body.nome, 'Nome Exemplo');
  assert.equal(body.email, 'usuario@exemplo.com');
  assert.equal(body.idade, 25);
  assert.equal(typeof body.id, 'number');

  await app.close();
});

test('POST /api/usuarios deve rejeitar nome inválido após normalização', async () => {
  const app = construirApp({
    logger: false,
  });

  const resposta = await app.inject({
    method: 'POST',
    url: '/api/usuarios',
    payload: {
      nome: '   ',
      email: 'usuario@exemplo.com',
      senha: senhaTeste,
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 400);
  assert.equal(body.error, 'Bad Request');
  assert.equal(
    body.message,
    'Nome deve possuir pelo menos 3 caracteres válidos',
  );

  await app.close();
});

test('GET /api/usuarios/:id deve retornar um usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuario = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'GET',
    url: `/api/usuarios/${usuario.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(body.id, usuario.id);
  assert.equal(body.nome, 'Nome Exemplo');
  assert.equal(body.email, 'usuario@exemplo.com');
  assert.equal(body.idade, 24);
  assert.equal(body.senha_hash, undefined);

  await app.close();
});

test('GET /api/usuarios/:id deve retornar 403 ao acessar id não autorizado', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'GET',
    url: '/api/usuarios/999',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 403);
  assert.equal(body.error, 'Forbidden');
  assert.equal(body.message, 'Acesso negado');

  await app.close();
});

test('GET /api/usuarios/:id admin deve receber 404 para usuário inexistente', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Administrador',
    email: 'admin@exemplo.com',
    senha: senhaTeste,
    idade: 30,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', senhaTeste);

  const resposta = await app.inject({
    method: 'GET',
    url: '/api/usuarios/999',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 404);
  assert.equal(body.error, 'Not Found');
  assert.equal(body.message, 'Usuário não encontrado');

  await app.close();
});

test('PUT /api/usuarios/:id deve atualizar um usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuario = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'PUT',
    url: `/api/usuarios/${usuario.id}`,
    payload: {
      nome: 'Nome Atualizado',
      email: 'usuario.atualizado@exemplo.com',
      idade: 25,
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(body.id, usuario.id);
  assert.equal(body.nome, 'Nome Atualizado');
  assert.equal(body.email, 'usuario.atualizado@exemplo.com');
  assert.equal(body.idade, 25);
  assert.equal(body.senha_hash, undefined);

  await app.close();
});

test('PUT /api/usuarios/:id deve retornar 403 ao acessar id não autorizado', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'PUT',
    url: '/api/usuarios/999',
    payload: {
      nome: 'Nome Atualizado',
      email: 'usuario.atualizado@exemplo.com',
      idade: 25,
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 403);
  assert.equal(body.error, 'Forbidden');
  assert.equal(body.message, 'Acesso negado');

  await app.close();
});

test('PUT /api/usuarios/:id admin deve receber 404 para usuário inexistente', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Administrador',
    email: 'admin@exemplo.com',
    senha: senhaTeste,
    idade: 30,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', senhaTeste);

  const resposta = await app.inject({
    method: 'PUT',
    url: '/api/usuarios/999',
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      nome: 'Nome Atualizado',
      email: 'usuario@exemplo.com',
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 404);
  assert.equal(body.error, 'Not Found');
  assert.equal(body.message, 'Usuário não encontrado');

  await app.close();
});

test('DELETE /api/usuarios/:id deve remover um usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuario = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'DELETE',
    url: `/api/usuarios/${usuario.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  assert.equal(resposta.statusCode, 204);

  const usuarioRemovido = await usuariosRepository.buscarUsuarioPorId(
    usuario.id,
  );

  assert.equal(usuarioRemovido, undefined);

  await app.close();
});

test('DELETE /api/usuarios/:id deve retornar 403 ao acessar id não autorizado', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'DELETE',
    url: '/api/usuarios/999',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 403);
  assert.equal(body.error, 'Forbidden');
  assert.equal(body.message, 'Acesso negado');

  await app.close();
});

test('DELETE /api/usuarios/:id admin deve receber 404 para usuário inexistente', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Administrador',
    email: 'admin@exemplo.com',
    senha: senhaTeste,
    idade: 30,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', senhaTeste);

  const resposta = await app.inject({
    method: 'DELETE',
    url: '/api/usuarios/999',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 404);
  assert.equal(body.error, 'Not Found');
  assert.equal(body.message, 'Usuário não encontrado');

  await app.close();
});

test('POST /api/login deve autenticar usuário com credenciais válidas', async () => {
  const app = construirApp({
    logger: false,
  });

  await app.inject({
    method: 'POST',
    url: '/api/usuarios',
    payload: {
      nome: 'Nome Exemplo',
      email: 'usuario@exemplo.com',
      senha: senhaTeste,
      idade: 24,
    },
  });

  const resposta = await app.inject({
    method: 'POST',
    url: '/api/login',
    payload: {
      email: 'usuario@exemplo.com',
      senha: senhaTeste,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(typeof body.token, 'string');
  assert.ok(body.token.length > 0);

  await app.close();
});

test('POST /api/login deve retornar 401 para senha incorreta', async () => {
  const app = construirApp({
    logger: false,
  });

  await app.inject({
    method: 'POST',
    url: '/api/usuarios',
    payload: {
      nome: 'Nome Exemplo',
      email: 'usuario@exemplo.com',
      senha: senhaTeste,
      idade: 24,
    },
  });

  const resposta = await app.inject({
    method: 'POST',
    url: '/api/login',
    payload: {
      email: 'usuario@exemplo.com',
      senha: 'senha-incorreta',
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 401);
  assert.equal(body.error, 'Unauthorized');
  assert.equal(body.message, 'Credenciais inválidas');

  await app.close();
});

test('POST /api/login deve retornar 401 para email inexistente', async () => {
  const app = construirApp({
    logger: false,
  });

  const resposta = await app.inject({
    method: 'POST',
    url: '/api/login',
    payload: {
      email: 'inexistente@exemplo.com',
      senha: senhaTeste,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 401);
  assert.equal(body.error, 'Unauthorized');
  assert.equal(body.message, 'Credenciais inválidas');

  await app.close();
});

test('PUT /api/usuarios/:id deve permitir usuário atualizar a própria conta', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioCriado = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'PUT',
    url: `/api/usuarios/${usuarioCriado.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      nome: 'Nome Atualizado',
      email: 'usuario.atualizado@exemplo.com',
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(body.id, usuarioCriado.id);
  assert.equal(body.nome, 'Nome Atualizado');
  assert.equal(body.email, 'usuario.atualizado@exemplo.com');
  assert.equal(body.idade, 25);

  await app.close();
});

test('PUT /api/usuarios/:id não deve permitir usuario atualizar conta de outro usuario', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Nome Exemplo 1',
    email: 'usuario1@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const usuario2 = await criarUsuario(app, {
    nome: 'Nome Exemplo 2',
    email: 'usuario2@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario1@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'PUT',
    url: `/api/usuarios/${usuario2.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      nome: 'Nome Atualizado 2',
      email: 'usuario2.atualizado@exemplo.com',
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 403);
  assert.equal(body.error, 'Forbidden');
  assert.equal(body.message, 'Acesso negado');

  await app.close();
});

test('DELETE /api/usuarios/:id não deve permitir usuario deletar conta de outro usuario', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Nome Exemplo 1',
    email: 'usuario1@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const usuario2 = await criarUsuario(app, {
    nome: 'Nome Exemplo 2',
    email: 'usuario2@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario1@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'DELETE',
    url: `/api/usuarios/${usuario2.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 403);
  assert.equal(body.error, 'Forbidden');
  assert.equal(body.message, 'Acesso negado');

  await app.close();
});

test('PUT /api/usuarios/:id admin pode alterar qualquer usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'admin@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', '123456');

  const usuario = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 21,
  });

  const resposta = await app.inject({
    method: 'PUT',
    url: `/api/usuarios/${usuario.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      nome: 'Nome Atualizado',
      email: 'usuario.atualizado@exemplo.com',
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(body.id, usuario.id);
  assert.equal(body.nome, 'Nome Atualizado');
  assert.equal(body.email, 'usuario.atualizado@exemplo.com');
  assert.equal(body.idade, 25);

  await app.close();
});

test('DELETE /api/usuarios/:id admin pode deletar qualquer usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'admin@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', '123456');

  const usuario = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 21,
  });

  const resposta = await app.inject({
    method: 'DELETE',
    url: `/api/usuarios/${usuario.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const usuarioRemovido = await usuariosRepository.buscarUsuarioPorId(
    usuario.id,
  );

  assert.equal(resposta.statusCode, 204);
  assert.equal(usuarioRemovido, undefined);

  await app.close();
});

test('GET /api/usuarios/:id deve permitir usuário buscar a própria conta', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuario = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  const token = await autenticarUsuario(app, 'usuario@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'GET',
    url: `/api/usuarios/${usuario.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(body.id, usuario.id);
  assert.equal(body.nome, 'Nome Exemplo');

  await app.close();
});

test('GET /api/usuarios/:id não deve permitir usuário buscar conta de outro usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Nome Exemplo 1',
    email: 'usuario1@exemplo.com',
    senha: '123456',
    idade: 20,
  });

  const usuario2 = await criarUsuario(app, {
    nome: 'Nome Exemplo 2',
    email: 'usuario2@exemplo.com',
    senha: '123456',
    idade: 21,
  });

  const token = await autenticarUsuario(app, 'usuario1@exemplo.com', '123456');

  const resposta = await app.inject({
    method: 'GET',
    url: `/api/usuarios/${usuario2.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 403);
  assert.equal(body.error, 'Forbidden');
  assert.equal(body.message, 'Acesso negado');

  await app.close();
});

test('GET /api/usuarios/:id admin pode buscar qualquer usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuarioAdmin = await criarUsuario(app, {
    nome: 'Nome Exemplo',
    email: 'admin@exemplo.com',
    senha: '123456',
    idade: 24,
  });

  await usuariosRepository.atualizarRoleUsuario(usuarioAdmin.id, 'admin');

  const token = await autenticarUsuario(app, 'admin@exemplo.com', '123456');

  const usuario = await criarUsuario(app, {
    nome: 'Nome Exemplo 2',
    email: 'usuario@exemplo.com',
    senha: '123456',
    idade: 21,
  });

  const resposta = await app.inject({
    method: 'GET',
    url: `/api/usuarios/${usuario.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 200);
  assert.equal(body.id, usuario.id);
  assert.equal(body.nome, 'Nome Exemplo 2');
  assert.equal(body.email, 'usuario@exemplo.com');

  await app.close();
});

test('POST /api/usuarios deve retornar 409 para e-mail já cadastrado', async () => {
  const app = construirApp({
    logger: false,
  });

  await criarUsuario(app, {
    nome: 'Usuário 1',
    email: 'usuario@exemplo.com',
    senha: senhaTeste,
    idade: 25,
  });

  const resposta = await app.inject({
    method: 'POST',
    url: '/api/usuarios',
    payload: {
      nome: 'Usuário 2',
      email: 'usuario@exemplo.com',
      senha: senhaTeste,
      idade: 30,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 409);
  assert.equal(body.error, 'Conflict');
  assert.equal(body.message, 'E-mail já cadastrado');

  await app.close();
});

test('PUT /api/usuarios/:id deve retornar 409 ao usar e-mail de outro usuário', async () => {
  const app = construirApp({
    logger: false,
  });

  const usuario1 = await criarUsuario(app, {
    nome: 'Usuário 1',
    email: 'usuario1@exemplo.com',
    senha: senhaTeste,
    idade: 25,
  });

  await criarUsuario(app, {
    nome: 'Usuário 2',
    email: 'usuario2@exemplo.com',
    senha: senhaTeste,
    idade: 30,
  });

  const token = await autenticarUsuario(
    app,
    'usuario1@exemplo.com',
    senhaTeste,
  );

  const resposta = await app.inject({
    method: 'PUT',
    url: `/api/usuarios/${usuario1.id}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      nome: 'Usuário 1',
      email: 'usuario2@exemplo.com',
      idade: 25,
    },
  });

  const body = JSON.parse(resposta.body);

  assert.equal(resposta.statusCode, 409);
  assert.equal(body.error, 'Conflict');
  assert.equal(body.message, 'E-mail já cadastrado');

  await app.close();
});
