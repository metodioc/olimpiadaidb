const { pool } = require('./src/config/database');
async function run() {
  // idSerie do Nível 1 para filial IDB Centro (idFilial=1)
  const [s] = await pool.query(`
    SELECT s.idSerie, s.codSerie, s.serie, s.idFilial, f.filial
    FROM tb_serie s JOIN tb_filial f ON s.idFilial = f.idFilial
    WHERE f.idFilial = 1 AND s.codSerie = 11
  `);
  console.log('Série Nível 1 para IDB Centro:', s);

  if (!s.length) { pool.end(); return; }
  const idSerie = s[0].idSerie;
  const codSerie = s[0].codSerie;

  // Alunos com codFilial=1 e codSerie=11 em 2026
  const [alunosDireto] = await pool.query(`
    SELECT COUNT(*) as total FROM tb_aluno WHERE codFilial=1 AND codSerie=? AND anoLetivo=2026
  `, [codSerie]);
  console.log(`\nAlunos direto (codFilial=1, codSerie=${codSerie}, 2026):`, alunosDireto[0].total);

  // Verificar o JOIN que o model faz: via t_map -> tb_turma -> tb_serie
  // O aluno tem codSerie direto, mas o model filtra por s.idSerie via turma
  const [viaJoin] = await pool.query(`
    SELECT COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a
    JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    JOIN (
      SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
      FROM tb_turma GROUP BY codTurma, idAnoLetivo
    ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
    JOIN tb_turma t ON t.idTurma = t_map.idTurma
    JOIN tb_serie s ON t.idSerie = s.idSerie
    WHERE a.anoLetivo = 2026 AND CAST(a.codFilial AS UNSIGNED) = 1 AND s.idSerie = ?
  `, [idSerie]);
  console.log(`\nAlunos via JOIN turma->serie (idSerie=${idSerie}):`, viaJoin[0].total);

  // Verificar via codSerie diretamente no aluno
  const [alunosComTurma] = await pool.query(`
    SELECT COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a
    JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    JOIN (
      SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
      FROM tb_turma GROUP BY codTurma, idAnoLetivo
    ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
    JOIN tb_turma t ON t.idTurma = t_map.idTurma
    WHERE a.anoLetivo = 2026 AND CAST(a.codFilial AS UNSIGNED) = 1 AND a.codSerie = ?
  `, [codSerie]);
  console.log(`\nAlunos via a.codSerie=${codSerie} (com turma mapeada):`, alunosComTurma[0].total);

  // Verificar quantos alunos de codSerie=11 têm turma mapeada para 2026
  const [semTurma] = await pool.query(`
    SELECT COUNT(*) as comTurma,
           SUM(CASE WHEN t_map.idTurma IS NULL THEN 1 ELSE 0 END) as semTurma
    FROM tb_aluno a
    JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    LEFT JOIN (
      SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
      FROM tb_turma GROUP BY codTurma, idAnoLetivo
    ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
    WHERE a.anoLetivo = 2026 AND CAST(a.codFilial AS UNSIGNED) = 1 AND a.codSerie = ?
  `, [codSerie]);
  console.log(`\nAlunos codSerie=${codSerie}, codFilial=1: comTurma=${semTurma[0].comTurma} semTurma=${semTurma[0].semTurma}`);

  // Checar se a série do join (via turma) tem idFilial diferente
  const [serieViaJoin] = await pool.query(`
    SELECT DISTINCT s.idSerie, s.codSerie, s.serie, s.idFilial
    FROM tb_aluno a
    JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    JOIN (
      SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
      FROM tb_turma GROUP BY codTurma, idAnoLetivo
    ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
    JOIN tb_turma t ON t.idTurma = t_map.idTurma
    JOIN tb_serie s ON t.idSerie = s.idSerie
    WHERE a.anoLetivo = 2026 AND a.codSerie = 11
    LIMIT 10
  `);
  console.log(`\nSéries resolvidas via turma para alunos com codSerie=11:`);
  serieViaJoin.forEach(r => console.log('  ', JSON.stringify(r)));

  pool.end();
}
run().catch(console.error);
