require('dotenv').config();
const { pool } = require('../src/config/database');

async function main() {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Remover duplicatas de codPessoa real (manter o de maior idPessoa)
    const [dups] = await conn.query(`
      SELECT codPessoa, COUNT(*) as qtd
      FROM tb_pessoa
      WHERE codPessoa IS NOT NULL AND codPessoa != '0'
      GROUP BY codPessoa
      HAVING COUNT(*) > 1
    `);

    console.log(`🔍 ${dups.length} codPessoa com duplicatas reais encontrados`);

    let removidos = 0;
    for (const dup of dups) {
      // Buscar todos os registros desse codPessoa ordenados por idPessoa DESC
      const [registros] = await conn.query(`
        SELECT idPessoa FROM tb_pessoa
        WHERE codPessoa = ?
        ORDER BY idPessoa DESC
      `, [dup.codPessoa]);

      // Manter o primeiro (maior idPessoa), deletar os demais
      const idsParaDeletar = registros.slice(1).map(r => r.idPessoa);
      if (idsParaDeletar.length > 0) {
        await conn.query(`DELETE FROM tb_pessoa WHERE idPessoa IN (?)`, [idsParaDeletar]);
        removidos += idsParaDeletar.length;
        console.log(`  🗑️  codPessoa=${dup.codPessoa}: removidas ${idsParaDeletar.length} duplicata(s), mantido idPessoa=${registros[0].idPessoa}`);
      }
    }

    console.log(`\n✅ Total de duplicatas removidas: ${removidos}`);

    // 2. Adicionar UNIQUE constraint em codPessoa (ignorando null e '0')
    // Primeiro verificar se já existe
    const [indices] = await conn.query(`
      SHOW INDEX FROM tb_pessoa WHERE Key_name = 'uq_codPessoa'
    `);

    if (indices.length === 0) {
      // Criar índice único apenas para valores não nulos e != '0'
      // MySQL não permite UNIQUE parcial direto, mas ignora NULLs automaticamente
      // Para excluir '0', precisamos de uma solução diferente
      // Vamos criar o índice UNIQUE normal (NULLs são permitidos múltiplos em UNIQUE)
      await conn.query(`
        ALTER TABLE tb_pessoa ADD UNIQUE INDEX uq_codPessoa (codPessoa)
      `);
      console.log(`\n🔒 UNIQUE constraint adicionado em tb_pessoa.codPessoa`);
    } else {
      console.log(`\n⚠️  UNIQUE constraint já existe`);
    }

    await conn.commit();

    // 3. Verificar resultado final
    const [[{ totalPessoas }]] = await conn.query(`SELECT COUNT(*) as totalPessoas FROM tb_pessoa`);
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
    console.log(`Total de pessoas na tb_pessoa: ${totalPessoas}`);
    console.log(`Sem JOIN (tb_aluno):           ${semJoin}`);
    console.log(`Com JOIN (tb_pessoa):          ${comJoin}`);
    console.log(`Diferença:                     ${comJoin - semJoin}`);
    if (comJoin - semJoin === 0) {
      console.log(`✅ JOIN agora retorna o mesmo número de linhas!`);
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
