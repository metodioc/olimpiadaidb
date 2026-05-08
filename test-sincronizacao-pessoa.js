require('dotenv').config();
const SincronizacaoPessoaService = require('./src/services/sincronizacaoPessoa.service');
const totvsService = require('./src/services/totvs.service');

async function testarSincronizacaoPessoa() {
  console.log('='.repeat(60));
  console.log('TESTE DE SINCRONIZAÇÃO - TB_PESSOA');
  console.log('='.repeat(60));
  console.log();

  try {
    // 1. Testar conexão com TOTVS
    console.log('1. Testando conexão com TOTVS (OLIMPIADAS001)...');
    const pessoasTotvs = await totvsService.getPessoas({ limit: 5 });
    
    if (!pessoasTotvs || pessoasTotvs.length === 0) {
      console.log('❌ Nenhuma pessoa retornada da API TOTVS');
      return;
    }

    console.log(`✅ Conexão OK - ${pessoasTotvs.length} pessoas retornadas (limite: 5)`);
    console.log();
    
    // 2. Mostrar exemplo de dados recebidos
    console.log('2. Exemplo de dados recebidos do TOTVS:');
    console.log(JSON.stringify(pessoasTotvs[0], null, 2));
    console.log();

    // 3. Testar mapeamento
    console.log('3. Testando mapeamento de dados...');
    const pessoaMapeada = totvsService.mapPessoaToLocal(pessoasTotvs[0]);
    console.log('Dados mapeados:');
    console.log(JSON.stringify(pessoaMapeada, null, 2));
    console.log();

    // 4. Executar sincronização
    console.log('4. Executando sincronização com banco de dados...');
    console.log('Aguarde...');
    console.log();
    
    const resultado = await SincronizacaoPessoaService.sincronizarPessoas();
    
    console.log('='.repeat(60));
    console.log('RESULTADO DA SINCRONIZAÇÃO');
    console.log('='.repeat(60));
    console.log(`Total de pessoas processadas: ${resultado.total}`);
    console.log(`Pessoas inseridas: ${resultado.inseridos}`);
    console.log(`Pessoas atualizadas: ${resultado.atualizados}`);
    console.log(`Erros: ${resultado.erros}`);
    console.log();

    if (resultado.detalhes && resultado.detalhes.length > 0) {
      console.log('Detalhes dos erros:');
      resultado.detalhes.forEach((detalhe, index) => {
        console.log(`${index + 1}. ${detalhe}`);
      });
      console.log();
    }

    console.log('✅ Teste concluído com sucesso!');
    console.log();

  } catch (error) {
    console.error('❌ ERRO NO TESTE:');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }

  process.exit(0);
}

// Executar teste
testarSincronizacaoPessoa();
