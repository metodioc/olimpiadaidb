require('dotenv').config();
const { pool } = require('../src/config/database');

async function main() {
  const conn = await pool.getConnection();

  // 1. Quantos codPessoa duplicados existem na tb_pessoa?
  const [dups] = await conn.query(`
    SELECT codPessoa, COUNT(*) as qtd
    FROM tb_pessoa
    GROUP BY codPessoa
    HAVING COUNT(*) > 1
    ORDER BY qtd DESC
    LIMIT 20
  `);

  console.log('=== codPessoa DUPLICADOS na tb_pessoa ===');
  console.log(`Total de codPessoa com duplicatas: ${dups.length}`);
  dups.forEach(r => console.log(`  codPessoa=${r.codPessoa}  qtd=${r.qtd}`));

  // 2. Impacto no JOIN com tb_aluno 2026 Matriculado
  const [[{ semJoin }]] = await conn.query(`
    SELECT COUNT(*) as semJoin FROM tb_aluno a
    WHERE a.anoLetivo=2026 AND a.situacao='Matriculado' AND a.codFilial IN (1,2,4,5)
  `);

  const [[{ comJoin }]] = await conn.query(`
    SELECT COUNT(*) as comJoin FROM tb_aluno a
    INNER JOIN tb_pessoa p ON p.codPessoa = a.codPessoa
    WHERE a.anoLetivo=2026 AND a.situacao='Matriculado' AND a.codFilial IN (1,2,4,5)
  `);

  console.log('\n=== IMPACTO NO JOIN ===');
  console.log(`Sem JOIN (tb_aluno):       ${semJoin}`);
  console.log(`Com JOIN (tb_pessoa):      ${comJoin}`);
  console.log(`Diferença (linhas extras): ${comJoin - semJoin}`);

  // 3. Quais codPessoa da tb_aluno têm duplicatas na tb_pessoa?
  if (dups.length > 0) {
    const codsDuplicados = dups.map(d => d.codPessoa);
    const placeholders = codsDuplicados.map(() => '?').join(',');

    const [alunosAfetados] = await conn.query(`
      SELECT a.ra, a.codPessoa, a.anoLetivo, a.situacao, COUNT(p.idPessoa) as qtdPessoas
      FROM tb_aluno a
      INNER JOIN tb_pessoa p ON p.codPessoa = a.codPessoa
      WHERE a.anoLetivo = 2026
        AND a.situacao = 'Matriculado'
        AND a.codFilial IN (1,2,4,5)
        AND a.codPessoa IN (${placeholders})
      GROUP BY a.ra, a.codPessoa, a.anoLetivo, a.situacao
      ORDER BY a.codPessoa
      LIMIT 20
    `, codsDuplicados);

    console.log('\n=== ALUNOS AFETADOS PELAS DUPLICATAS ===');
    console.log(`(mostrando até 20 exemplos)`);
    alunosAfetados.forEach(r =>
      console.log(`  RA=${r.ra}  codPessoa=${r.codPessoa}  qtdPessoas=${r.qtdPessoas}`)
    );
  }

  // 4. Verificar se tb_pessoa tem UNIQUE em codPessoa
  const [indices] = await conn.query(`
    SHOW INDEX FROM tb_pessoa WHERE Column_name = 'codPessoa'
  `);
  console.log('\n=== ÍNDICES em tb_pessoa.codPessoa ===');
  if (indices.length === 0) {
    console.log('  ⚠️  NENHUM índice em codPessoa — sem UNIQUE constraint!');
  } else {
    indices.forEach(i =>
      console.log(`  Key_name=${i.Key_name}  Non_unique=${i.Non_unique}  (Non_unique=0 significa UNIQUE)`)
    );
  }

  conn.release();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
