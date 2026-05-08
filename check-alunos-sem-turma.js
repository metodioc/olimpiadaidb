const { pool } = require('./src/config/database');
async function run() {
  const ras = ['2026-4195', '2025-4179', '2026-4222'];

  for (const ra of ras) {
    const [alunos] = await pool.query(`SELECT * FROM tb_aluno WHERE ra = ?`, [ra]);
    if (!alunos.length) { console.log(`RA ${ra}: NÃO ENCONTRADO`); continue; }
    const a = alunos[0];
    console.log(`\n--- RA: ${ra} ---`);
    console.log(`  codFilial=${a.codFilial} codSerie=${a.codSerie} codTurma=${a.codTurma} anoLetivo=${a.anoLetivo} situacao=${a.situacao}`);

    // Verificar se existe a turma com esse codTurma no ano letivo
    const [turmas] = await pool.query(`
      SELECT t.idTurma, t.codTurma, t.turma, t.idSerie, t.idAnoLetivo, al.anoLetivo
      FROM tb_turma t
      JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
      WHERE t.codTurma = ? AND al.anoLetivo = ?
    `, [a.codTurma, a.anoLetivo]);
    console.log(`  Turmas com codTurma=${a.codTurma} em anoLetivo=${a.anoLetivo}:`, turmas.length > 0 ? turmas : 'NENHUMA');

    // Verificar todas as turmas com esse codTurma (qualquer ano)
    const [todasTurmas] = await pool.query(`
      SELECT t.idTurma, t.codTurma, t.turma, t.idSerie, t.idAnoLetivo, al.anoLetivo, s.serie, s.idFilial
      FROM tb_turma t
      JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
      JOIN tb_serie s ON t.idSerie = s.idSerie
      WHERE t.codTurma = ?
      ORDER BY al.anoLetivo DESC
    `, [a.codTurma]);
    console.log(`  Todas as turmas com codTurma=${a.codTurma}:`, todasTurmas.map(t => `[idTurma=${t.idTurma} anoLetivo=${t.anoLetivo} filial idFilial=${t.idFilial} serie=${t.serie}]`).join(', ') || 'NENHUMA');

    // Verificar codSerie na tabela de série
    const [series] = await pool.query(`SELECT * FROM tb_serie WHERE codSerie = ? AND idFilial IN (SELECT idFilial FROM tb_filial WHERE codFilial = ?)`, [a.codSerie, a.codFilial]);
    console.log(`  Série codSerie=${a.codSerie} na filial codFilial=${a.codFilial}:`, series.length > 0 ? series.map(s => `[idSerie=${s.idSerie} serie=${s.serie}]`).join(', ') : 'NÃO ENCONTRADA');
  }

  pool.end();
}
run().catch(console.error);
