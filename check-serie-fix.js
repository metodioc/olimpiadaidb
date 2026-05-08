const { pool } = require('./src/config/database');
async function run() {
  // Simula o filtro corrigido: idSerie=18 (Nível 1 IDB Centro) -> codSerie=11 -> filtra a.codSerie
  const [r] = await pool.query(`
    SELECT COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a
    LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
    WHERE a.anoLetivo = 2026
      AND a.codSerie = (SELECT codSerie FROM tb_serie WHERE idSerie = 18)
      AND f.idFilial = 1
  `);
  console.log('Alunos Nível 1 (idSerie=18) + IDB Centro (idFilial=1) em 2026:', r[0].total);
  pool.end();
}
run().catch(console.error);
