const { validationResult } = require('express-validator');
const SincronizacaoService = require('../services/sincronizacao.service');

class SincronizacaoController {

  /**
   * Sincronizar todos os alunos
   */
  static async sincronizarTodos(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { idFilial, idAnoLetivo } = req.body;

      const resultado = await SincronizacaoService.sincronizarAlunos({
        idFilial,
        idAnoLetivo
      });

      return res.status(200).json({
        success: true,
        message: 'Sincronização concluída',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar com TOTVS',
        error: error.message
      });
    }
  }

  /**
   * Sincronização incremental
   */
  static async sincronizarIncremental(req, res) {
    try {
      const { dataUltimaSync } = req.body;

      const resultado = await SincronizacaoService.sincronizacaoIncremental(
        dataUltimaSync || new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h por padrão
      );

      return res.status(200).json({
        success: true,
        message: 'Sincronização incremental concluída',
        data: resultado
      });

    } catch (error) {
      console.error('Erro na sincronização incremental:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro na sincronização incremental',
        error: error.message
      });
    }
  }

  /**
   * Verificar status da conexão com TOTVS
   */
  static async verificarConexao(req, res) {
    try {
      const totvsService = require('../services/totvs.service');
      
      // Testar conexão fazendo uma requisição simples
      const alunos = await totvsService.getAlunos({ limit: 1 });

      return res.status(200).json({
        success: true,
        message: 'Conexão com TOTVS estabelecida com sucesso',
        conectado: true,
        totalAlunos: Array.isArray(alunos) ? alunos.length : 0
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Falha na conexão com TOTVS',
        conectado: false,
        error: error.message
      });
    }
  }

  /**
   * Executar sincronização manualmente (fora do cron)
   */
  static async sincronizarManual(req, res) {
    try {
      const SincronizacaoJob = require('../jobs/sincronizacao.job');
      const resultado = await SincronizacaoJob.executarAgora();

      return res.status(200).json({
        success: true,
        message: 'Sincronização manual executada com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error('Erro na sincronização manual:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro na sincronização manual',
        error: error.message
      });
    }
  }
}

module.exports = SincronizacaoController;
