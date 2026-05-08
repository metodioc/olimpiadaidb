/**
 * Script mestre de sincronização completa com TOTVS
 * Ordem: anos letivos → filiais → séries → turmas → pessoas → alunos
 */

require('dotenv').config();

const SincronizacaoAnoLetivoService = require('./src/services/sincronizacaoAnoLetivo.service');
const SincronizacaoFilialService    = require('./src/services/sincronizacaoFilial.service');
const SincronizacaoSerieService     = require('./src/services/sincronizacaoSerie.service');
const SincronizacaoTurmaService     = require('./src/services/sincronizacaoTurma.service');
const SincronizacaoPessoaService    = require('./src/services/sincronizacaoPessoa.service');
const SincronizacaoService          = require('./src/services/sincronizacao.service');

const etapas = [
  {
    nome: 'TB_ANO_LETIVO (OLIMPIADAS006)',
    fn: () => SincronizacaoAnoLetivoService.sincronizarAnosLetivos()
  },
  {
    nome: 'TB_FILIAL (OLIMPIADAS002)',
    fn: () => SincronizacaoFilialService.sincronizarFiliais()
  },
  {
    nome: 'TB_SERIE (OLIMPIADAS003)',
    fn: () => SincronizacaoSerieService.sincronizarSeries()
  },
  {
    nome: 'TB_TURMA (OLIMPIADAS004)',
    fn: () => SincronizacaoTurmaService.sincronizarTurmas()
  },
  {
    nome: 'TB_PESSOA (OLIMPIADAS001)',
    fn: () => SincronizacaoPessoaService.sincronizarPessoas()
  },
  {
    nome: 'TB_ALUNO (OLIMPIADAS005)',
    fn: () => SincronizacaoService.sincronizarAlunos()
  }
];

function imprimirResultado(nome, resultado) {
  const inseridos  = resultado.inseridos  ?? resultado.inseridas  ?? 0;
  const atualizados = resultado.atualizados ?? resultado.atualizadas ?? 0;
  const erros      = resultado.erros?.length ?? 0;

  console.log(`   ✅ Total: ${resultado.total}  |  ➕ ${inseridos} inseridos  |  🔄 ${atualizados} atualizados  |  ❌ ${erros} erros`);

  if (erros > 0) {
    console.log(`   ⚠️  Detalhes dos erros:`);
    resultado.erros.slice(0, 5).forEach((e, i) => {
      console.log(`      ${i + 1}. ${JSON.stringify(e)}`);
    });
    if (erros > 5) console.log(`      ... e mais ${erros - 5} erro(s).`);
  }
}

async function sincronizarTudo() {
  console.log('═'.repeat(60));
  console.log('  SINCRONIZAÇÃO COMPLETA COM TOTVS EDUCACIONAL');
  console.log('═'.repeat(60));
  console.log(`  Início: ${new Date().toLocaleString('pt-BR')}`);
  console.log('═'.repeat(60));
  console.log();

  const resumo = [];

  for (const etapa of etapas) {
    console.log(`▶ ${etapa.nome}`);
    try {
      const resultado = await etapa.fn();
      imprimirResultado(etapa.nome, resultado);
      resumo.push({ etapa: etapa.nome, status: 'OK', resultado });
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}`);
      resumo.push({ etapa: etapa.nome, status: 'ERRO', erro: error.message });
    }
    console.log();
  }

  console.log('═'.repeat(60));
  console.log('  RESUMO FINAL');
  console.log('═'.repeat(60));
  resumo.forEach(r => {
    const icone = r.status === 'OK' ? '✅' : '❌';
    console.log(`  ${icone} ${r.etapa}`);
  });
  console.log();
  console.log(`  Fim: ${new Date().toLocaleString('pt-BR')}`);
  console.log('═'.repeat(60));

  process.exit(0);
}

sincronizarTudo();
