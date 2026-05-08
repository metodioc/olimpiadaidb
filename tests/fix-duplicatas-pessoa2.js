require('dotenv').config();
const { pool } = require('../src/config/database');

async function main() {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Converter codPessoa='0' para NULL (são registros sem código válido)
    const [res0] = await conn.query(`
      UPDATE tb_pessoa SET codPessoa = NULL WHERE codPessoa = '0'
    `);
    console.log(`🔧 ${res0.affectedRows} registros com codPessoa='0' → NULL`);

    // 2. Adicionar UNIQUE constraint (NULL é permitido múltiplos em UNIQUE)
    await conn.query(`
      ALTER TABLE tb_pessoa ADD UNIQUE INDEX uq_codPessoa (codPessoa)
    `);
    console.log(`🔒 UNIQUE constraint adicionado em tb_pessoa.codPessoa`);

    await conn.commit();

    // 3. Verificar resultado final do JOIN
    const [[{ semJoin }]] = await conn.query(`
      SELECT COUNT(*) as semJoin FROM tb_aluno a
      WHERE a.anoLetivo=2026 AND a.situacao='Matriculado' AND a.codFilial IN (1,2,4,5)
    `);
    const [[{ comJoin }]] = await conn.query(`
      SELECT COUNT(*) as comJoin FROM tb_aluno a
      INNER JOIN tb_pessoa p ON p.codPessoa = a.codPessoa
      WHERE a.anoLetivo=2026 AND a.situacao='Matriculado' AND a.codFilial IN (1,2,4,5)
    `);

    console.log(`\n=== RESULTADO FINAL ===`);
    console.log(`Sem JOIN (tb_aluno):  ${semJoin}`);
    console.log(`Com JOIN (tb_pessoa): ${comJoin}`);
    console.log(`Diferença:            ${comJoin - semJoin}`);

    if (comJoin - semJoin === 0) {
      console.log(`✅ JOIN retorna o mesmo número de linhas!`);
    } else {
      console.log(`⚠️  Ainda há diferença — investigar mais.`);
    }

  } catch (err) {
    await conn.rollback();
    console.error('❌ Erro:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
