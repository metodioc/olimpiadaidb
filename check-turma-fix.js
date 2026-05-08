const { pool } = require('./src/config/database');
async function run() {
  // Turma 11A (idTurma=2041) IDB Centro Nivel 1 2026
  const [r] = await pool.query(`
    SELECT COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a
    LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
    WHERE a.anoLetivo = 2026
      AND a.codTurma = (SELECT codTurma FROM tb_turma WHERE idTurma = 2041)
      AND f.idFilial = 1
  `);
  console.log('Alunos turma 11A (idTurma=2041) IDB Centro 2026:', r[0].total);

  // Sem filtro de filial, só turma
  const [r2] = await pool.query(`
    SELECT COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a
    WHERE a.anoLetivo = 2026
      AND a.codTurma = (SELECT codTurma FROM tb_turma WHERE idTurma = 2041)
  `);
  console.log('Alunos turma 11A (sem filtro filial):', r2[0].total);
  pool.end();
}
run().catch(console.error);
