/**
 * Script de teste para sincronização de turmas com TOTVS
 */

// Carregar variáveis de ambiente
require('dotenv').config();

const totvsService = require('../src/services/totvs.service');
const SincronizacaoTurmaService = require('../src/services/sincronizacaoTurma.service');

async function testarSincronizacaoTurmas() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     TESTE DE SINCRONIZAÇÃO DE TURMAS - TOTVS RM         ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Testar conexão com TOTVS
    console.log('1️⃣  Testando conexão com TOTVS Educacional...\n');
    const turmas = await totvsService.getTurmas();
    
    console.log(`✅ Conexão estabelecida com sucesso!`);
    console.log(`📊 Total de turmas encontradas: ${turmas.length}\n`);

    // 2. Mostrar exemplos de dados
    if (turmas.length > 0) {
      console.log('2️⃣  Exemplo de dados retornados do TOTVS:\n');
      console.log('─────────────────────────────────────────────────────────');
      turmas.slice(0, 3).forEach((turma, index) => {
        console.log(`\nTurma ${index + 1}:`);
        console.log(`   Código: ${turma.CODTURMA || turma.codTurma}`);
        console.log(`   Nome: ${turma.TURMA || turma.turma}`);
        console.log(`   Série: ${turma.CODSERIE || turma.codSerie}`);
        console.log(`   Ano Letivo: ${turma.ANOLETIVO || turma.anoLetivo}`);
        console.log(`   Turno: ${turma.TURNO || turma.turno}`);
        console.log(`   Filial: ${turma.CODFILIAL || turma.codFilial}`);
      });
      console.log('\n─────────────────────────────────────────────────────────\n');

      // 3. Testar mapeamento
      console.log('3️⃣  Testando mapeamento de dados:\n');
      const primeiraTurma = turmas[0];
      const turmaMapeada = totvsService.mapTurmaToLocal(primeiraTurma);
      
      console.log('Dados originais (TOTVS):');
      console.log(JSON.stringify(primeiraTurma, null, 2));
      console.log('\nDados mapeados (Local):');
      console.log(JSON.stringify(turmaMapeada, null, 2));
      console.log('\n');
    }

    // 4. Executar sincronização
    console.log('4️⃣  Executando sincronização completa...\n');
    const resultado = await SincronizacaoTurmaService.sincronizarTurmas();

    // 5. Exibir resultados
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║                  RESULTADO DA SINCRONIZAÇÃO              ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    console.log(`📊 Total de turmas processadas: ${resultado.total}`);
    console.log(`✅ Inseridos: ${resultado.inseridos}`);
    console.log(`🔄 Atualizados: ${resultado.atualizados}`);
    console.log(`❌ Erros: ${resultado.erros.length}\n`);

    if (resultado.erros.length > 0) {
      console.log('⚠️  Detalhes dos erros:\n');
      resultado.erros.forEach((erro, index) => {
        console.log(`${index + 1}. Turma ${erro.codTurma}: ${erro.erro}`);
      });
      console.log('\n');
    }

    console.log('✅ Teste concluído com sucesso!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error);
    console.error('\nDetalhes do erro:');
    console.error(error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Executar teste
testarSincronizacaoTurmas();
