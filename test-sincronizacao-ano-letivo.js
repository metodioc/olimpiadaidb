require('dotenv').config();
const SincronizacaoAnoLetivoService = require('./src/services/sincronizacaoAnoLetivo.service');
const totvsService = require('./src/services/totvs.service');

async function testarSincronizacaoAnoLetivo() {
  console.log('='.repeat(60));
  console.log('TESTE DE SINCRONIZAÇÃO - TB_ANO_LETIVO');
  console.log('='.repeat(60));
  console.log();

  try {
    // 1. Testar conexão com TOTVS
    console.log('1. Testando conexão com TOTVS (OLIMPIADAS006)...');
    const anosLetivoTotvs = await totvsService.getAnosLetivos();

    if (!anosLetivoTotvs || anosLetivoTotvs.length === 0) {
      console.log('❌ Nenhum ano letivo retornado da API TOTVS');
      return;
    }

    console.log(`✅ Conexão OK - ${anosLetivoTotvs.length} ano(s) letivo(s) retornado(s)`);
    console.log();

    // 2. Mostrar exemplo de dados recebidos
    console.log('2. Exemplo de dados recebidos do TOTVS:');
    console.log(JSON.stringify(anosLetivoTotvs[0], null, 2));
    console.log();

    // 3. Testar mapeamento
    console.log('3. Testando mapeamento de dados...');
    const mapeado = totvsService.mapAnoLetivoToLocal(anosLetivoTotvs[0]);
    console.log('Dados mapeados:');
    console.log(JSON.stringify(mapeado, null, 2));
    console.log();

    // 4. Executar sincronização
    console.log('4. Executando sincronização com banco de dados...');
    console.log('Aguarde...');
    console.log();

    const resultado = await SincronizacaoAnoLetivoService.sincronizarAnosLetivos();

    console.log('='.repeat(60));
    console.log('RESULTADO DA SINCRONIZAÇÃO');
    console.log('='.repeat(60));
    console.log(`Total de anos letivos processados: ${resultado.total}`);
    console.log(`Inseridos: ${resultado.inseridos}`);
    console.log(`Atualizados: ${resultado.atualizados}`);
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

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Resposta:', error.response.data);
    }
  } finally {
    process.exit(0);
  }
}

testarSincronizacaoAnoLetivo();
