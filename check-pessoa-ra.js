const { pool } = require('./src/config/database');
async function check() {
  const ras = ['2025-4179', '2026-4195', '2026-4222'];
  for (const ra of ras) {
    const [rows] = await pool.query('SELECT idAluno, ra, codPessoa, codFilial, codSerie, codTurma, anoLetivo, situacao FROM tb_aluno WHERE ra = ?', [ra]);
    if (!rows.length) { console.log(ra + ': NAO ENCONTRADO em tb_aluno'); continue; }
    const a = rows[0];
    console.log('\n--- RA:', ra, '---');
    console.log('  codPessoa:', a.codPessoa, '| codFilial:', a.codFilial, '| codSerie:', a.codSerie, '| codTurma:', a.codTurma, '| situacao:', a.situacao);
    if (a.codPessoa) {
      const [p] = await pool.query('SELECT codPessoa, nome, email FROM tb_pessoa WHERE codPessoa = ?', [a.codPessoa]);
      console.log('  tb_pessoa:', p.length ? JSON.stringify(p[0]) : 'NAO ENCONTRADO (codPessoa existe mas sem registro em tb_pessoa)');
    } else {
      console.log('  codPessoa = NULL => sem vinculo com tb_pessoa, nome ficara em branco');
    }
  }
  pool.end();
}
check().catch(console.error);
