const { pool } = require('./src/config/database');
async function run() {
  // Testar os 3 alunos problemáticos
  const [r1] = await pool.query(`
    SELECT a.ra, a.codFilial, a.codSerie, a.codTurma,
           t.idTurma, t.turma as turma_nome, s.serie as serie_nome, f.filial as filial_nome
    FROM tb_aluno a
    LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
    LEFT JOIN tb_turma t ON t.codTurma = a.codTurma
      AND t.idAnoLetivo = al.idAnoLetivo
      AND t.idSerie = (
        SELECT s2.idSerie FROM tb_serie s2
        WHERE s2.codSerie = a.codSerie AND s2.idFilial = f.idFilial
        LIMIT 1
      )
    LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
    WHERE a.ra IN ('2026-4195','2025-4179','2026-4222')
  `);
  console.log('3 alunos IDB Pré:');
  r1.forEach(r => console.log(`  ra=${r.ra} turma=${r.turma_nome} serie=${r.serie_nome} filial=${r.filial_nome} idTurma=${r.idTurma}`));

  // Testar aluno IDB Centro com codTurma=11A (antes resolvia para IDB Leste)
  const [r2] = await pool.query(`
    SELECT a.ra, a.codFilial, a.codSerie, a.codTurma,
           t.idTurma, t.turma as turma_nome, s.serie as serie_nome, f.filial as filial_nome
    FROM tb_aluno a
    LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
    LEFT JOIN tb_turma t ON t.codTurma = a.codTurma
      AND t.idAnoLetivo = al.idAnoLetivo
      AND t.idSerie = (
        SELECT s2.idSerie FROM tb_serie s2
        WHERE s2.codSerie = a.codSerie AND s2.idFilial = f.idFilial
        LIMIT 1
      )
    LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
    WHERE a.codTurma = '11A' AND a.anoLetivo = 2026 AND a.codFilial = '1'
    LIMIT 3
  `);
  console.log('\nAlunos IDB Centro codTurma=11A (devem ter idTurma=2041):');
  r2.forEach(r => console.log(`  ra=${r.ra} turma=${r.turma_nome} serie=${r.serie_nome} filial=${r.filial_nome} idTurma=${r.idTurma}`));

  // Testar aluno IDB Leste com codTurma=11A (devem ter idTurma=2183)
  const [r3] = await pool.query(`
    SELECT a.ra, a.codFilial, a.codSerie, a.codTurma,
           t.idTurma, t.turma as turma_nome, s.serie as serie_nome, f.filial as filial_nome
    FROM tb_aluno a
    LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
    LEFT JOIN tb_turma t ON t.codTurma = a.codTurma
      AND t.idAnoLetivo = al.idAnoLetivo
      AND t.idSerie = (
        SELECT s2.idSerie FROM tb_serie s2
        WHERE s2.codSerie = a.codSerie AND s2.idFilial = f.idFilial
        LIMIT 1
      )
    LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
    WHERE a.codTurma = '11A' AND a.anoLetivo = 2026 AND a.codFilial = '4'
    LIMIT 3
  `);
  console.log('\nAlunos IDB Leste codTurma=11A (devem ter idTurma=2183):');
  r3.forEach(r => console.log(`  ra=${r.ra} turma=${r.turma_nome} serie=${r.serie_nome} filial=${r.filial_nome} idTurma=${r.idTurma}`));

  pool.end();
}
run().catch(console.error);
