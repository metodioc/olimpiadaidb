const { validationResult } = require('express-validator');
const SincronizacaoAnoLetivoService = require('../services/sincronizacaoAnoLetivo.service');
const totvsService = require('../services/totvs.service');

class SincronizacaoAnoLetivoController {

  /**
   * Sincronizar todos os anos letivos
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

      const resultado = await SincronizacaoAnoLetivoService.sincronizarAnosLetivos({
        idAnoLetivo
      });

      return res.status(200).json({
        success: true,
        message: 'Sincronização de anos letivos concluída',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao sincronizar anos letivos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar anos letivos com TOTVS',
        error: error.message
      });
    }
  }

  /**
   * Verificar status da conexão com TOTVS (anos letivos)
   */
  static async verificarConexao(req, res) {
    try {
      const anosLetivos = await totvsService.getAnosLetivos();

      return res.status(200).json({
        success: true,
        message: 'Conexão com TOTVS estabelecida com sucesso',
        conectado: true,
        totalAnosLetivos: Array.isArray(anosLetivos) ? anosLetivos.length : 0
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

module.exports = SincronizacaoAnoLetivoController;
