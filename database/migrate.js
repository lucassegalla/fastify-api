const fs = require('fs');
const path = require('path');
const db = require('./connection');

async function executarMigrations() {
  const pastaMigrations = path.join(__dirname, 'migrations');

  const arquivos = fs
    .readdirSync(pastaMigrations)
    .filter((arquivo) => arquivo.endsWith('.sql'))
    .sort();

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) UNIQUE NOT NULL,
        executada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const resultado = await db.query(
      'SELECT nome FROM _migrations ORDER BY id',
    );

    const migrationsExecutadas = new Set(
      resultado.rows.map((migration) => migration.nome),
    );

    for (const arquivo of arquivos) {
      if (migrationsExecutadas.has(arquivo)) {
        console.log(`Migration já executada: ${arquivo}`);
        continue;
      }

      const caminhoArquivo = path.join(pastaMigrations, arquivo);
      const sql = fs.readFileSync(caminhoArquivo, 'utf8');

      console.log(`Executando migration: ${arquivo}`);

      await db.query('BEGIN');

      try {
        await db.query(sql);

        await db.query('INSERT INTO _migrations (nome) VALUES ($1)', [arquivo]);

        await db.query('COMMIT');
      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
    }

    console.log('Migrations executadas com sucesso.');
  } catch (error) {
    console.error('Erro ao executar migrations:', error);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

executarMigrations();
