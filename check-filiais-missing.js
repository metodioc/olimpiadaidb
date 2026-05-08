const { pool } = require('./src/config/database');
async function run() {
  // Ver codFilial 5 e 6 - buscar info via codSerie/codTurma para identificar a filial
  const [filiais] = await pool.query('SELECT * FROM tb_filial ORDER BY idFilial');
  console.log('Filiais cadastradas:');
  filiais.forEach(f => console.log(`  idFilial=${f.idFilial} codFilial=${f.codFilial||'N/A'} abFilial=${f.abFilial} filial=${f.filial}`));

  // Verificar colunas de tb_filial
  const [cols] = await pool.query('DESCRIBE tb_filial');
  console.log('\nColunas tb_filial:', cols.map(c => c.Field).join(', '));

  // Alunos com codFilial 5 - pegar sample de codSerie e codTurma
  const [am5] = await pool.query(`
    SELECT a.codFilial, a.codSerie, a.codTurma, COUNT(*) as total
    FROM tb_aluno a WHERE a.codFilial IN (5,6) AND a.anoLetivo=2026
    GROUP BY a.codFilial, a.codSerie, a.codTurma
    ORDER BY a.codFilial, total DESC LIMIT 20
  `);
  console.log('\nAlunos codFilial 5 e 6 (por codSerie/codTurma):');
  am5.forEach(r => console.log(`  codFilial=${r.codFilial} codSerie=${r.codSerie} codTurma=${r.codTurma}: ${r.total}`));

  // Verificar séries dessas filiais no TOTVS sincronizado
  const [series5] = await pool.query(`
    SELECT s.*, f.filial, f.idFilial
    FROM tb_serie s
    LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
    WHERE s.codSerie IN (
      SELECT DISTINCT codSerie FROM tb_aluno WHERE codFilial IN (5,6) AND anoLetivo=2026
    )
  `);
  console.log('\nSéries dos alunos de codFilial 5 e 6:');
  series5.forEach(r => console.log(`  codSerie=${r.codSerie} serie=${r.serie} idFilial=${r.idFilial} filial=${r.filial}`));

  pool.end();
}
run().catch(console.error);
