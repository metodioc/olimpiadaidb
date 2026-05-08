require('dotenv').config();
const totvsService = require('./src/services/totvs.service');
const { pool } = require('./src/config/database');

async function testarPessoaEspecifica() {
  console.log('='.repeat(60));
  console.log('TESTE - PESSOA ESPECÍFICA (codPessoa: 52743)');
  console.log('='.repeat(60));
  console.log();

  try {
    // 1. Buscar no banco local
    console.log('1. Buscando no banco local...');
    const connection = await pool.getConnection();
    const [pessoaLocal] = await connection.query(
      'SELECT * FROM tb_pessoa WHERE codPessoa = ?',
      [52743]
    );
    connection.release();

    if (pessoaLocal.length > 0) {
      console.log('Dados no banco local:');
      console.log(JSON.stringify(pessoaLocal[0], null, 2));
    } else {
      console.log('❌ Pessoa não encontrada no banco local');
    }
    console.log();

    // 2. Buscar todas as pessoas do TOTVS
    console.log('2. Buscando todas as pessoas do TOTVS...');
    const totvsPessoas = await totvsService.getPessoas();
    console.log(`Total de pessoas retornadas: ${totvsPessoas.length}`);
    console.log();

    // 3. Procurar a pessoa específica
    console.log('3. Procurando pessoa com codpessoa = 52743...');
    const pessoaTotvs = totvsPessoas.find(p => p.codpessoa == 52743 || p.CODPESSOA == 52743 || p.codPessoa == 52743);
    
    if (pessoaTotvs) {
      console.log('✅ Pessoa encontrada no TOTVS:');
      console.log('Dados brutos:');
      console.log(JSON.stringify(pessoaTotvs, null, 2));
      console.log();
      
      console.log('Dados após mapeamento:');
      const pessoaMapeada = totvsService.mapPessoaToLocal(pessoaTotvs);
      console.log(JSON.stringify(pessoaMapeada, null, 2));
      console.log();

      // 4. Comparar
      if (pessoaLocal.length > 0) {
        console.log('4. Comparação:');
        console.log(`Nome no banco: "${pessoaLocal[0].nome}"`);
        console.log(`Nome no TOTVS: "${pessoaMapeada.nome}"`);
        console.log(`São diferentes? ${pessoaLocal[0].nome !== pessoaMapeada.nome}`);
      }
    } else {
      console.log('❌ Pessoa NÃO encontrada no TOTVS');
      console.log();
      console.log('Verificando possíveis variações do campo codpessoa...');
      
      // Mostrar primeiros 5 registros para ver a estrutura
      console.log('Primeiros 5 registros do TOTVS:');
      totvsPessoas.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. Campos disponíveis:`, Object.keys(p));
        console.log('   Dados:', JSON.stringify(p, null, 2));
      });
    }

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error(error.stack);
  }

  process.exit(0);
}

testarPessoaEspecifica();
