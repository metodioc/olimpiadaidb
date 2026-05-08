const { pool } = require('./src/config/database');

async function check() {
  // Colunas de tb_aluno
  const [cols] = await pool.query('DESCRIBE tb_aluno');
  console.log('Colunas tb_aluno:', cols.map(c => c.Field).join(', '));

  const hasFilial = cols.some(c => c.Field.toLowerCase().includes('filial'));
  console.log('Tem coluna filial direta:', hasFilial);

  // Total matriculados 2026 sem filtro
  const [total] = await pool.query("SELECT COUNT(*) as total FROM tb_aluno WHERE situacao = 'M' AND anoLetivo = 2026");
  console.log('Total MATRICULADOS 2026 (sem filtro de filial):', total[0].total);

  // Listar filiais disponíveis em tb_filial
  const [filiais] = await pool.query('SELECT idFilial, filial FROM tb_filial ORDER BY filial');
  console.log('\nFiliais:');
  filiais.forEach(f => console.log(`  [${f.idFilial}] ${f.filial}`));

  // Contar matriculados via join turma->serie->filial por filial
  const [porFilial] = await pool.query(`
    SELECT f.idFilial, f.filial, COUNT(DISTINCT a.idAluno) as total
    FROM tb_aluno a
    JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
    JOIN (
      SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
      FROM tb_turma GROUP BY codTurma, idAnoLetivo
    ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
    JOIN tb_turma t ON t.idTurma = t_map.idTurma
    JOIN tb_serie s ON t.idSerie = s.idSerie
    JOIN tb_filial f ON s.idFilial = f.idFilial
    WHERE a.situacao = 'M' AND a.anoLetivo = 2026
    GROUP BY f.idFilial, f.filial
    ORDER BY f.filial
  `);
  console.log('\nMatriculados 2026 por filial (via turma->serie->filial):');
  let sumViaJoin = 0;
  porFilial.forEach(r => { console.log(`  [${r.idFilial}] ${r.filial}: ${r.total}`); sumViaJoin += parseInt(r.total); });
  console.log('  SOMA:', sumViaJoin);

  // Verificar se tb_aluno tem codFilial
  if (hasFilial) {
    const filialCol = cols.find(c => c.Field.toLowerCase().includes('filial')).Field;
    console.log(`\nColuna filial em tb_aluno: ${filialCol}`);
    const [porFilialDireto] = await pool.query(`
      SELECT ${filialCol}, COUNT(*) as total FROM tb_aluno
      WHERE situacao = 'M' AND anoLetivo = 2026
      GROUP BY ${filialCol} ORDER BY ${filialCol}
    `);
    console.log('Matriculados 2026 por filial (direto em tb_aluno):');
    porFilialDireto.forEach(r => console.log(`  ${r[filialCol]}: ${r.total}`));
  }

  await pool.end();
}

check().catch(console.error);
