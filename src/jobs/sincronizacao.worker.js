require('dotenv').config();
const { parentPort } = require('worker_threads');
const SincronizacaoService = require('../services/sincronizacao.service');
const SincronizacaoPessoaService = require('../services/sincronizacaoPessoa.service');

/**
 * Worker Thread para sincronização com TOTVS
 * Executa em paralelo sem bloquear o servidor principal
 * 
 * Este worker apenas delega o trabalho para SincronizacaoService
 * evitando duplicação de código
 */

(async () => {
  try {
    // Enviar progresso inicial
    parentPort.postMessage({
      tipo: 'progresso',
      mensagem: 'Iniciando sincronização com TOTVS...'
    });

    // Usar o serviço de sincronização existente (código centralizado)
    const resultado = await SincronizacaoService.sincronizarAlunos();

    // Sincronizar pessoas (tb_pessoa) para garantir que nomes estejam presentes
    try {
      await SincronizacaoPessoaService.sincronizarPessoas();
    } catch (errPessoa) {
      console.error('⚠️  Erro ao sincronizar pessoas (não crítico):', errPessoa.message);
    }

    // Enviar resultado final
    parentPort.postMessage({
      tipo: 'sucesso',
      data: resultado
    });

    process.exit(0);

  } catch (error) {
    // Enviar erro
    parentPort.postMessage({
      tipo: 'erro',
      mensagem: error.message
    });
    
    process.exit(1);
  }
})();
