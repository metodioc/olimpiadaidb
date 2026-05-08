const { pool } = require('./src/config/database');
async function run() {
  const [r] = await pool.query(`
    SELECT a.codFilial, f.filial, COUNT(*) as total
    FROM tb_aluno a
    LEFT JOIN tb_filial f ON a.codFilial = f.idFilial
    WHERE a.anoLetivo = 2026
    GROUP BY a.codFilial, f.filial
    ORDER BY f.filial
  `);
  r.forEach(x => console.log((x.filial || 'SEM FILIAL cod=' + x.codFilial) + ': ' + x.total));
  pool.end();
}
run().catch(console.error);
