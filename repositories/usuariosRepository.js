const db = require('../database/connection');

async function listarUsuarios(limit, offset) {
  const resultado = await db.query(
    `
      SELECT
      id,
      nome,
      email,
      idade
      FROM usuarios
      ORDER BY id
      LIMIT $1
      OFFSET $2;
    `,
    [limit, offset],
  );
  return resultado.rows;
}

async function contarUsuarios() {
  const resultadoTotal = await db.query('SELECT COUNT(*) FROM usuarios');

  return Number(resultadoTotal.rows[0].count);
}

async function criarUsuario(usuario) {
  const resultado = await db.query(
    `
      INSERT INTO usuarios (nome, email, senha_hash, idade)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, idade;
    `,
    [usuario.nome, usuario.email, usuario.senha_hash, usuario.idade],
  );

  return resultado.rows[0];
}

async function buscarUsuarioPorId(id) {
  const resultado = await db.query(
    `
      SELECT
      id,
      nome,
      email,
      idade
      FROM usuarios
      WHERE id = $1;
    `,
    [id],
  );
  return resultado.rows[0];
}

async function buscarUsuarioPorEmail(email) {
  const resultado = await db.query(
    `
    SELECT
      id,
      nome,
      email,
      senha_hash,
      idade
    FROM usuarios
    WHERE email = $1;
    `,
    [email],
  );
  return resultado.rows[0];
}

async function atualizarUsuario(id, dadosAtualizados) {
  const resultado = await db.query(
    `
      UPDATE usuarios
      SET nome = $1,
          email = $2,
          idade = $3
      WHERE id = $4
      RETURNING id, nome, email, idade;
    `,
    [dadosAtualizados.nome, dadosAtualizados.email, dadosAtualizados.idade, id],
  );
  return resultado.rows[0];
}

async function removerUsuario(id) {
  const resultado = await db.query(
    `
      DELETE FROM usuarios
      WHERE id = $1
      RETURNING id, nome, email, idade;
    `,
    [id],
  );
  return resultado.rows[0];
}

async function limparUsuarios() {
  await db.query('TRUNCATE TABLE usuarios RESTART IDENTITY');
}

module.exports = {
  listarUsuarios,
  contarUsuarios,
  criarUsuario,
  atualizarUsuario,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  removerUsuario,
  limparUsuarios,
};
