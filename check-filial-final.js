const { pool } = require('./src/config/database');
async function run() {
  const [r] = await pool.query(`
    SELECT f.idFilial, f.codFilial, f.filial, COUNT(*) as total
    FROM tb_aluno a
    LEFT JOIN tb_filial f ON a.codFilial = f.codFilial
    WHERE a.anoLetivo = 2026
    GROUP BY f.idFilial, f.codFilial, f.filial
    ORDER BY f.filial
  `);
  console.log('Alunos 2026 por filial (join correto a.codFilial = f.codFilial):');
  r.forEach(x => console.log(`  idFilial=${x.idFilial} codFilial=${x.codFilial} ${x.filial||'SEM FILIAL'}: ${x.total}`));
  pool.end();
}
run().catch(console.error);
