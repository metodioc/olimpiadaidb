/**
 * Teste de sincronização de alunos com nova estrutura
 * Query TOTVS: OLIMPIADAS005
 */

require('dotenv').config();
const sincronizacaoService = require('../src/services/sincronizacao.service');

async function testarSincronizacao() {
  console.log('='.repeat(60));
  console.log('🧪 TESTE DE SINCRONIZAÇÃO DE ALUNOS');
  console.log('='.repeat(60));
  console.log('');
  console.log('📋 Configuração:');
  console.log(`   - Query TOTVS: OLIMPIADAS005`);
  console.log(`   - Sem parâmetros`);
  console.log('');
  console.log('📊 Nova estrutura da tb_aluno:');
  console.log('   - ra, situacao, tipo, sistema, idGrupoEscola');
  console.log('   - codPessoa (relaciona com tb_pessoa.codPessoa)');
  console.log('   - codTurma (relaciona com tb_turma.codTurma)');
  console.log('   - codFilial (relaciona com tb_filial.codFilial)');
  console.log('   - codSerie (relaciona com tb_serie.codSerie)');
  console.log('   - anoLetivo (relaciona com tb_ano_letivo.anoLetivo)');
  console.log('');
  console.log('='.repeat(60));
  console.log('');

  try {
    console.log('⏳ Iniciando sincronização...\n');
    
    const resultado = await sincronizacaoService.sincronizarAlunos();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ RESULTADO DA SINCRONIZAÇÃO');
    console.log('='.repeat(60));
    console.log(`📊 Total de registros no TOTVS: ${resultado.total}`);
    console.log(`✅ Inseridos: ${resultado.inseridos}`);
    console.log(`🔄 Atualizados: ${resultado.atualizados}`);
    console.log(`🚌 Transferidos: ${resultado.transferidos}`);
    console.log(`❌ Erros: ${resultado.erros.length}`);
    console.log('');

    if (resultado.erros.length > 0) {
      console.log('⚠️  ERROS ENCONTRADOS:');
      console.log('-'.repeat(60));
      resultado.erros.slice(0, 10).forEach((erro, i) => {
        console.log(`${i + 1}. RA: ${erro.ra}`);
        console.log(`   Erro: ${erro.erro}`);
        console.log('');
      });
      
      if (resultado.erros.length > 10) {
        console.log(`   ... e mais ${resultado.erros.length - 10} erros`);
      }
    }

    if (resultado.detalhes.length > 0) {
      console.log('\n📝 PRIMEIROS REGISTROS PROCESSADOS:');
      console.log('-'.repeat(60));
      resultado.detalhes.slice(0, 5).forEach((detalhe, i) => {
        console.log(`${i + 1}. RA: ${detalhe.ra} - ${detalhe.acao.toUpperCase()}`);
      });
      
      if (resultado.detalhes.length > 5) {
        console.log(`   ... e mais ${resultado.detalhes.length - 5} registros`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Teste concluído com sucesso!');
    console.log('='.repeat(60));

    process.exit(0);

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ ERRO NO TESTE');
    console.error('='.repeat(60));
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('='.repeat(60));
    process.exit(1);
  }
}

// Executar teste
testarSincronizacao();
