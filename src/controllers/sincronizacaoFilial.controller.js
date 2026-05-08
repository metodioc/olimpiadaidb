const { validationResult } = require('express-validator');
const SincronizacaoFilialService = require('../services/sincronizacaoFilial.service');

class SincronizacaoFilialController {

  /**
   * Sincronizar todas as filiais
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

      const resultado = await SincronizacaoFilialService.sincronizarFiliais();

      return res.status(200).json({
        success: true,
        message: 'Sincronização de filiais concluída',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao sincronizar filiais:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar filiais com TOTVS',
        error: error.message
      });
    }
  }

  /**
   * Verificar status da conexão com TOTVS (filiais)
   */
  static async verificarConexao(req, res) {
    try {
      const totvsService = require('../services/totvs.service');
      
      // Testar conexão fazendo uma requisição simples
      const filiais = await totvsService.getFiliais();

      return res.status(200).json({
        success: true,
        message: 'Conexão com TOTVS estabelecida com sucesso',
        conectado: true,
        totalFiliais: Array.isArray(filiais) ? filiais.length : 0
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

module.exports = SincronizacaoFilialController;
