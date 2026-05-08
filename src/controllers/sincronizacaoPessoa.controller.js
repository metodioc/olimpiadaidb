const { validationResult } = require('express-validator');
const SincronizacaoPessoaService = require('../services/sincronizacaoPessoa.service');

class SincronizacaoPessoaController {

  /**
   * Sincronizar todas as pessoas
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

      const resultado = await SincronizacaoPessoaService.sincronizarPessoas({
        idAnoLetivo
      });

      return res.status(200).json({
        success: true,
        message: 'Sincronização de pessoas concluída',
        data: resultado
      });

    } catch (error) {
      console.error('Erro ao sincronizar pessoas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao sincronizar pessoas com TOTVS',
        error: error.message
      });
    }
  }

  /**
   * Verificar status da conexão com TOTVS (pessoas)
   */
  static async verificarConexao(req, res) {
    try {
      const totvsService = require('../services/totvs.service');
      
      // Testar conexão fazendo uma requisição simples
      const pessoas = await totvsService.getPessoas({ limit: 1 });

      return res.status(200).json({
        success: true,
        message: 'Conexão com TOTVS estabelecida com sucesso',
        conectado: true,
        totalPessoas: Array.isArray(pessoas) ? pessoas.length : 0
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

module.exports = SincronizacaoPessoaController;
