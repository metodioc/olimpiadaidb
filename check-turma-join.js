const { pool } = require('./src/config/database');
async function run() {
  // Pegar uma turma de Nível 1 do IDB Centro 2026 e ver seu idSerie e codTurma
  const [turmas] = await pool.query(`
    SELECT t.idTurma, t.codTurma, t.turma, t.idSerie, s.codSerie, s.serie, s.idFilial, f.filial
    FROM tb_turma t
    JOIN tb_serie s ON t.idSerie = s.idSerie
    JOIN tb_filial f ON s.idFilial = f.idFilial
    JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
    WHERE al.anoLetivo = 2026 AND s.idFilial = 1 AND s.codSerie = 11
    LIMIT 5
  `);
  console.log('Turmas Nível 1 IDB Centro 2026:');
  turmas.forEach(r => console.log(' ', JSON.stringify(r)));

  if (!turmas.length) { pool.end(); return; }
  const idTurma = turmas[0].idTurma;
  const codTurma = turmas[0].codTurma;

  // Filtro atual: t.idTurma via join t_map
  const [viaJoin] = await pool.query(`
    SELECT COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a
    JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    JOIN (
      SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
      FROM tb_turma GROUP BY codTurma, idAnoLetivo
    ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
    JOIN tb_turma t ON t.idTurma = t_map.idTurma
    WHERE a.anoLetivo = 2026 AND t.idTurma = ?
  `, [idTurma]);
  console.log(`\nAlunos via JOIN t.idTurma=${idTurma}:`, viaJoin[0].total);

  // Filtro correto: a.codTurma direto
  const [viaCod] = await pool.query(`
    SELECT COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a WHERE a.anoLetivo=2026 AND a.codTurma = ?
  `, [codTurma]);
  console.log(`Alunos via a.codTurma=${codTurma}:`, viaCod[0].total);

  pool.end();
}
run().catch(console.error);
