const { pool } = require('./src/config/database');
async function run() {
  // Verificar se há turmas duplicadas (mesmo codTurma, mesmo anoLetivo) em 2026
  const [dup] = await pool.query(`
    SELECT t.codTurma, al.anoLetivo, COUNT(*) as cnt, GROUP_CONCAT(t.idTurma ORDER BY t.idTurma) as ids, GROUP_CONCAT(s.idFilial ORDER BY t.idTurma) as filiais
    FROM tb_turma t
    JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
    JOIN tb_serie s ON t.idSerie = s.idSerie
    WHERE al.anoLetivo = 2026
    GROUP BY t.codTurma, al.anoLetivo
    HAVING cnt > 1
    ORDER BY t.codTurma
  `);
  console.log('Turmas duplicadas (mesmo codTurma) em 2026:');
  if (dup.length === 0) console.log('  NENHUMA');
  dup.forEach(r => console.log(`  codTurma=${r.codTurma} anoLetivo=${r.anoLetivo}: ids=[${r.ids}] filiais=[${r.filiais}]`));

  // Verificar especificamente 34A e 34F em 2026
  const [t34] = await pool.query(`
    SELECT t.idTurma, t.codTurma, t.turma, t.idSerie, s.serie, s.idFilial, f.filial, al.anoLetivo
    FROM tb_turma t
    JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
    JOIN tb_serie s ON t.idSerie = s.idSerie
    JOIN tb_filial f ON s.idFilial = f.idFilial
    WHERE al.anoLetivo = 2026 AND t.codTurma IN ('34A','34F')
    ORDER BY t.codTurma, f.filial
  `);
  console.log('\nTurmas 34A e 34F em 2026:');
  t34.forEach(r => console.log(`  idTurma=${r.idTurma} codTurma=${r.codTurma} serie=${r.serie} filial=${r.filial} idFilial=${r.idFilial}`));

  // Verificar o t_map que o model usa para os alunos 2026-4195 e 2026-4222
  // aluno: codTurma=34A, anoLetivo=2026
  const [tmap] = await pool.query(`
    SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
    FROM tb_turma
    WHERE codTurma IN ('34A','34F')
    GROUP BY codTurma, idAnoLetivo
    ORDER BY codTurma, idAnoLetivo DESC
    LIMIT 10
  `);
  console.log('\nt_map (MAX idTurma por codTurma+idAnoLetivo):');
  tmap.forEach(r => console.log(`  codTurma=${r.codTurma} idAnoLetivo=${r.idAnoLetivo} MAX(idTurma)=${r.idTurma}`));

  // Ver o que o findAll retorna para esses alunos - simulando o JOIN completo
  const [result] = await pool.query(`
    SELECT a.ra, a.codFilial, a.codSerie, a.codTurma, a.anoLetivo, a.situacao,
           t.idTurma, t.turma as turma_nome, s.serie as serie_nome, f.filial as filial_nome
    FROM tb_aluno a
    LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    LEFT JOIN (
      SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
      FROM tb_turma GROUP BY codTurma, idAnoLetivo
    ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
    LEFT JOIN tb_turma t ON t.idTurma = t_map.idTurma
    LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
    LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
    WHERE a.ra IN ('2026-4195','2025-4179','2026-4222')
  `);
  console.log('\nResultado do JOIN para os 3 alunos:');
  result.forEach(r => console.log(`  ra=${r.ra} turma_nome=${r.turma_nome} serie_nome=${r.serie_nome} filial_nome=${r.filial_nome} idTurma=${r.idTurma}`));

  pool.end();
}
run().catch(console.error);
