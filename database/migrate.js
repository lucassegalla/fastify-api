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
    for (const arquivo of arquivos) {
      const caminhoArquivo = path.join(pastaMigrations, arquivo);
      const sql = fs.readFileSync(caminhoArquivo, 'utf8');

      console.log(`Executando migration: ${arquivo}`);

      await db.query(sql);
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
