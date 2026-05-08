const { pool } = require('./src/config/database');

async function check() {
  // Verificar anoLetivo e situacao distribuição
  const [anos] = await pool.query('SELECT anoLetivo, situacao, COUNT(*) as total FROM tb_aluno GROUP BY anoLetivo, situacao ORDER BY anoLetivo DESC, situacao LIMIT 30');
  console.log('Distribuição por anoLetivo e situacao:');
  anos.forEach(r => console.log(`  anoLetivo=${r.anoLetivo} situacao=${r.situacao}: ${r.total}`));

  // Verificar valores de codFilial em tb_aluno
  const [codsFilial] = await pool.query('SELECT DISTINCT codFilial FROM tb_aluno ORDER BY codFilial LIMIT 20');
  console.log('\nValores de codFilial em tb_aluno:', codsFilial.map(r => r.codFilial).join(', '));

  // Verificar codFilial vs tb_filial
  const [filiais] = await pool.query('SELECT idFilial, filial, abFilial FROM tb_filial');
  console.log('\ntb_filial:');
  filiais.forEach(f => console.log(`  idFilial=${f.idFilial} abFilial=${f.abFilial} filial=${f.filial}`));

  // Contar por codFilial direto (sem filtro situacao)
  const [porCodFilial] = await pool.query(`
    SELECT codFilial, COUNT(*) as total FROM tb_aluno
    WHERE anoLetivo = (SELECT MAX(anoLetivo) FROM tb_aluno)
    GROUP BY codFilial ORDER BY codFilial
  `);
  console.log('\nAlunos no ultimo anoLetivo por codFilial:');
  porCodFilial.forEach(r => console.log(`  codFilial=${r.codFilial}: ${r.total}`));

  await pool.end();
}

check().catch(console.error);
