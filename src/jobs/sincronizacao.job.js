const cron = require('node-cron');
const { Worker } = require('worker_threads');
const path = require('path');

/**
 * Job de sincronização automática com TOTVS
 * Executa a cada 1 hora em uma thread separada
 */
class SincronizacaoJob {
  
  static iniciar() {
    // Executar a cada 1 hora (0 minutos de cada hora)
    // Formato: minuto hora dia mês dia-da-semana
    const tarefa = cron.schedule('0 * * * *', () => {
      console.log('\n🕐 [Cron Job] Iniciando sincronização automática com TOTVS...');
      console.log(`⏰ Horário: ${new Date().toLocaleString('pt-BR')}`);
      console.log('🧵 Executando em thread separada...\n');
      
      // Criar worker thread para executar sincronização
      const worker = new Worker(path.join(__dirname, 'sincronizacao.worker.js'));
      
      // Escutar mensagens do worker
      worker.on('message', (resultado) => {
        if (resultado.tipo === 'progresso') {
          console.log(`   📊 Progresso: ${resultado.mensagem}`);
        } else if (resultado.tipo === 'sucesso') {
          console.log('✅ [Cron Job] Sincronização concluída com sucesso!');
          console.log(`   📊 Total: ${resultado.data.total} alunos`);
          console.log(`   ➕ Inseridos: ${resultado.data.inseridos}`);
          console.log(`   🔄 Atualizados: ${resultado.data.atualizados}`);
          console.log(`   ❌ Erros: ${resultado.data.erros.length}`);
          
          if (resultado.data.erros.length > 0) {
            console.log('   ⚠️  Detalhes dos erros:');
            resultado.data.erros.slice(0, 10).forEach(erro => {
              console.log(`      - RA ${erro.ra}: ${erro.erro}`);
            });
            if (resultado.data.erros.length > 10) {
              console.log(`      ... e mais ${resultado.data.erros.length - 10} erros`);
            }
          }
        }
      });
      
      // Escutar erros do worker
      worker.on('error', (error) => {
        console.error('❌ [Cron Job] Erro na sincronização automática:', error.message);
      });
      
      // Escutar finalização do worker
      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`❌ [Worker] Thread finalizada com código de erro: ${code}`);
        }
        console.log('⏸️  [Cron Job] Próxima execução em 1 hora\n');
      });
      
    }, {
      scheduled: false, // Não iniciar automaticamente
      timezone: "America/Sao_Paulo"
    });

    // Iniciar o job
    tarefa.start();
    
    console.log('✅ Cron job de sincronização TOTVS iniciado');
    console.log('⏰ Intervalo: A cada 1 hora (0 minutos de cada hora)');
    console.log('🌎 Timezone: America/Sao_Paulo');
    console.log('🧵 Modo: Worker Threads (execução em paralelo)');
    console.log(`📅 Próxima execução: ${this.proximaExecucao()}\n`);
    
    return tarefa;
  }

  /**
   * Calcular próxima execução
   */
  static proximaExecucao() {
    const agora = new Date();
    const proxima = new Date(agora);
    proxima.setHours(agora.getHours() + 1);
    proxima.setMinutes(0);
    proxima.setSeconds(0);
    proxima.setMilliseconds(0);
    
    return proxima.toLocaleString('pt-BR');
  }

  /**
   * Executar sincronização manualmente (fora do cron)
   */
  static async executarAgora() {
    console.log('🚀 Executando sincronização manual em thread separada...');
    
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, 'sincronizacao.worker.js'));
      
      worker.on('message', (resultado) => {
        if (resultado.tipo === 'sucesso') {
          console.log('✅ Sincronização manual concluída!');
          resolve(resultado.data);
        }
      });
      
      worker.on('error', (error) => {
        console.error('❌ Erro na sincronização manual:', error.message);
        reject(error);
      });
      
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker finalizado com código: ${code}`));
        }
      });
    });
  }
}

module.exports = SincronizacaoJob;
