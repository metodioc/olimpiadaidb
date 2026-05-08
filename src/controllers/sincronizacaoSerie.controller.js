const { validationResult } = require('express-validator');
const SincronizacaoSerieService = require('../services/sincronizacaoSerie.service');

class SincronizacaoSerieController {

  /**
   * Sincronizar todas as séries
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

      const { idAnoLetivo } = req.body;

      const resultado = await SincronizacaoSerieService.sincronizarSeries({
        idAnoLetivo
      });

      return res.status(200).json({
        success: true,
        message: 'Sincronização de séries concluída',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao sincronizar séries:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar séries com TOTVS',
        error: error.message
      });
    }
  }

  /**
   * Verificar status da conexão com TOTVS (séries)
   */
  static async verificarConexao(req, res) {
    try {
      const totvsService = require('../services/totvs.service');
      
      // Testar conexão fazendo uma requisição simples
      const series = await totvsService.getSeries({ limit: 1 });

      return res.status(200).json({
        success: true,
        message: 'Conexão com TOTVS estabelecida com sucesso',
        conectado: true,
        totalSeries: Array.isArray(series) ? series.length : 0
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
}

module.exports = SincronizacaoSerieController;
