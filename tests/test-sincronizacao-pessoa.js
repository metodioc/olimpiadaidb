require('dotenv').config();
const sincronizacaoService = require('../src/services/sincronizacao.service');

async function main() {
  console.log('============================================================');
  console.log('🧪 TESTE DE SINCRONIZAÇÃO DE PESSOAS');
  console.log('============================================================\n');

  try {
    const resultado = await sincronizacaoService.sincronizarPessoas();

    console.log('\n============================================================');
    console.log('✅ RESULTADO DA SINCRONIZAÇÃO');
    console.log('============================================================');
    console.log(`📊 Total de registros no TOTVS: ${resultado.total}`);
    console.log(`➕ Inseridas: ${resultado.inseridas}`);
    console.log(`🔄 Atualizadas: ${resultado.atualizadas}`);
    console.log(`❌ Erros: ${resultado.erros.length}`);

    if (resultado.erros.length > 0) {
      console.log('\n⚠️  ERROS:');
      resultado.erros.slice(0, 10).forEach((e, i) => {
        console.log(`  ${i + 1}. codPessoa: ${e.codPessoa} → ${e.erro}`);
      });
    }

    console.log('\n============================================================');
    console.log('✅ Teste concluído com sucesso!');
    console.log('============================================================');
  } catch (error) {
    console.error('\n❌ FALHA NO TESTE:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
