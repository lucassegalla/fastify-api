const db = require('../database/connection');

async function listarUsuarios() {
  const resultado = await db.query('SELECT * FROM usuarios');
  return resultado.rows;
}

async function criarUsuario(usuario) {
  const resultado = await db.query(
    `
      INSERT INTO usuarios (nome, idade)
      VALUES ($1, $2)
      RETURNING *;
    `,
    [usuario.nome, usuario.idade],
  );

  return resultado.rows[0];
}

async function buscarUsuarioPorId(id) {
  const resultado = await db.query(
    `
      SELECT *
      FROM usuarios
      WHERE id = $1;
    `,
    [id],
  );
  return resultado.rows[0];
}

async function atualizarUsuario(id, dadosAtualizados) {
  const resultado = await db.query(
    `
      UPDATE usuarios
      SET nome = $1,
          idade = $2
      WHERE id = $3
      RETURNING *;
    `,
    [dadosAtualizados.nome, dadosAtualizados.idade, id],
  );
  return resultado.rows[0];
}

async function removerUsuario(id) {
  const resultado = await db.query(
    `
      DELETE FROM usuarios
      WHERE id = $1
      RETURNING *;
    `,
    [id],
  );
  return resultado.rows[0];
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
  removerUsuario,
};
