const { pool } = require('./src/config/database');
async function run() {
  const [r] = await pool.query(`
    SELECT s.codSerie, s.serie, s.idFilial, f.filial, COUNT(*) as qtd
    FROM tb_serie s
    LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
    GROUP BY s.codSerie, s.serie, s.idFilial, f.filial
    ORDER BY s.codSerie, f.filial
  `);
  console.log('Séries agrupadas por codSerie+filial:');
  r.forEach(x => console.log(`  codSerie=${x.codSerie} serie=${x.serie} filial=${x.filial}: qtd=${x.qtd}`));

  const [total] = await pool.query('SELECT COUNT(*) as total FROM tb_serie');
  console.log('\nTotal de registros em tb_serie:', total[0].total);

  // Ver sample das séries duplicadas
  const [dup] = await pool.query(`
    SELECT codSerie, COUNT(*) as cnt FROM tb_serie GROUP BY codSerie HAVING cnt > 1 ORDER BY cnt DESC LIMIT 10
  `);
  console.log('\ncodSerie com mais de 1 registro:');
  dup.forEach(x => console.log(`  codSerie=${x.codSerie}: ${x.cnt} registros`));

  // Ver os registros de um codSerie duplicado
  if (dup.length > 0) {
    const [detail] = await pool.query('SELECT * FROM tb_serie WHERE codSerie = ? ORDER BY idSerie', [dup[0].codSerie]);
    console.log(`\nDetalhe do codSerie=${dup[0].codSerie}:`);
    detail.forEach(x => console.log('  ', JSON.stringify(x)));
  }

  pool.end();
}
run().catch(console.error);
