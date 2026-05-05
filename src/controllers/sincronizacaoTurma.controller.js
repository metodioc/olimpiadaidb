const SincronizacaoTurmaService = require('../services/sincronizacaoTurma.service');
const totvsService = require('../services/totvs.service');

/**
 * Controller de sincronização de turmas
 */
class SincronizacaoTurmaController {

  /**
   * Sincronizar todas as turmas
   */
  static async sincronizarTodos(req, res) {
    try {
      console.log('🔄 Requisição de sincronização de turmas recebida');
      
      const filters = {};
      
      // Filtro opcional por ano letivo
      if (req.query.idAnoLetivo) {
        filters.idAnoLetivo = parseInt(req.query.idAnoLetivo);
      }

      const resultado = await SincronizacaoTurmaService.sincronizarTurmas(filters);

      res.status(200).json({
        mensagem: 'Sincronização de turmas concluída com sucesso',
        resultado
      });

    } catch (error) {
      console.error('❌ Erro na sincronização de turmas:', error);
      res.status(500).json({
        mensagem: 'Erro ao sincronizar turmas',
        erro: error.message
      });
    }
  }

  /**
   * Verificar conexão com TOTVS
   */
  static async verificarConexao(req, res) {
    try {
      const turmas = await totvsService.getTurmas();
      
      res.status(200).json({
        mensagem: 'Conexão com TOTVS estabelecida',
        totalTurmas: turmas.length,
        exemplos: turmas.slice(0, 3)
      });

    } catch (error) {
      console.error('❌ Erro ao verificar conexão:', error);
      res.status(500).json({
        mensagem: 'Erro ao conectar com TOTVS',
        erro: error.message
      });
    }
  }
}

module.exports = SincronizacaoTurmaController;
