require('dotenv').config();
const SincronizacaoSerieService = require('./src/services/sincronizacaoSerie.service');
const totvsService = require('./src/services/totvs.service');

async function testarSincronizacaoSerie() {
  console.log('='.repeat(60));
  console.log('TESTE DE SINCRONIZAÇÃO - TB_SERIE');
  console.log('='.repeat(60));
  console.log();

  try {
    // 1. Testar conexão com TOTVS
    console.log('1. Testando conexão com TOTVS (OLIMPIADAS003)...');
    const seriesTotvs = await totvsService.getSeries();
    
    if (!seriesTotvs || seriesTotvs.length === 0) {
      console.log('❌ Nenhuma série retornada da API TOTVS');
      return;
    }

    console.log(`✅ Conexão OK - ${seriesTotvs.length} séries retornadas`);
    console.log();
    
    // 2. Mostrar exemplo de dados recebidos
    console.log('2. Exemplo de dados recebidos do TOTVS:');
    console.log(JSON.stringify(seriesTotvs[0], null, 2));
    console.log();

    // 3. Testar mapeamento
    console.log('3. Testando mapeamento de dados...');
    const serieMapeada = totvsService.mapSerieToLocal(seriesTotvs[0]);
    console.log('Dados mapeados:');
    console.log(JSON.stringify(serieMapeada, null, 2));
    console.log();

    // 4. Executar sincronização
    console.log('4. Executando sincronização com banco de dados...');
    console.log('Aguarde...');
    console.log();
    
    const resultado = await SincronizacaoSerieService.sincronizarSeries();
    
    console.log('='.repeat(60));
    console.log('RESULTADO DA SINCRONIZAÇÃO');
    console.log('='.repeat(60));
    console.log(`Total de séries processadas: ${resultado.total}`);
    console.log(`Séries inseridas: ${resultado.inseridos}`);
    console.log(`Séries atualizadas: ${resultado.atualizados}`);
    console.log(`Erros: ${resultado.erros.length}`);
    console.log();

    if (resultado.erros.length > 0) {
      console.log('Detalhes dos erros:');
      resultado.erros.forEach((erro, index) => {
        console.log(`${index + 1}. ${JSON.stringify(erro)}`);
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
testarSincronizacaoSerie();
