const { pool } = require('./src/config/database');
async function run() {
  // Contar alunos 2026 por codFilial direto em tb_aluno
  const [raw] = await pool.query(`
    SELECT codFilial, COUNT(*) as total FROM tb_aluno WHERE anoLetivo=2026 GROUP BY codFilial ORDER BY codFilial
  `);
  console.log('tb_aluno.codFilial distribuição 2026:');
  raw.forEach(r => console.log(`  codFilial=${r.codFilial}: ${r.total}`));

  // Checar o codFilial=5 em tb_filial
  const [f5] = await pool.query('SELECT * FROM tb_filial WHERE codFilial=5 OR idFilial=3');
  console.log('\ntb_filial onde codFilial=5 ou idFilial=3:');
  f5.forEach(r => console.log('  ', JSON.stringify(r)));

  // Tipo do campo codFilial nas duas tabelas
  const [colA] = await pool.query("SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_NAME='tb_aluno' AND COLUMN_NAME='codFilial'");
  const [colF] = await pool.query("SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_NAME='tb_filial' AND COLUMN_NAME='codFilial'");
  console.log('\ntb_aluno.codFilial tipo:', colA[0]);
  console.log('tb_filial.codFilial tipo:', colF[0]);

  pool.end();
}
run().catch(console.error);
