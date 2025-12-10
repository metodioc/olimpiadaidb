const { validationResult } = require('express-validator');
const OlimpiadaModel = require('../models/Olimpiada.model');

/**
 * Controller de Olimpíadas
 * Gerencia requisições HTTP relacionadas às olimpíadas
 */
class OlimpiadaController {
  
  /**
   * GET /api/olimpiadas
   * Listar todas as olimpíadas (com filtros opcionais)
   */
  static async list(req, res) {
    try {
      const { ano, status } = req.query;
      
      const olimpiadas = await OlimpiadaModel.findAll({ ano, status });
      
      return res.status(200).json({
        success: true,
        total: olimpiadas.length,
        data: olimpiadas
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao listar olimpíadas',
        details: error.message
      });
    }
  }
  
  /**
   * GET /api/olimpiadas/:id
   * Obter detalhes de uma olimpíada
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      
      const olimpiada = await OlimpiadaModel.findById(id);
      
      if (!olimpiada) {
        return res.status(404).json({
          error: 'Olimpíada não encontrada'
        });
      }
      
      // Buscar disciplinas e filiais relacionadas
      const disciplinas = await OlimpiadaModel.getDisciplinas(id);
      const filiais = await OlimpiadaModel.getFiliais(id);
      
      return res.status(200).json({
        olimpiada: {
          ...olimpiada,
          disciplinas,
          filiais
        }
      });
      
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar olimpíada',
        details: error.message
      });
    }
  }
  
  /**
   * POST /api/olimpiadas
   * Criar nova olimpíada
   */
  static async create(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Dados inválidos',
          details: errors.array() 
        });
      }
      
      const { disciplinas, filiais, ...olimpiadaData } = req.body;
      
      // Se não informou responsável, usa o usuário logado
      if (!olimpiadaData.idUsuarioResponsavel) {
        olimpiadaData.idUsuarioResponsavel = req.user.id_usuario;
      }
      
      // Criar olimpíada
      const olimpiadaId = await OlimpiadaModel.create(olimpiadaData);
      
      // Vincular disciplinas se informadas
      if (disciplinas && disciplinas.length > 0) {
        await OlimpiadaModel.addDisciplinas(olimpiadaId, disciplinas);
      }
      
      // Vincular filiais se informadas
      if (filiais && filiais.length > 0) {
        await OlimpiadaModel.addFiliais(olimpiadaId, filiais);
      }
      
      // Buscar olimpíada criada
      const novaOlimpiada = await OlimpiadaModel.findById(olimpiadaId);
      
      return res.status(201).json({
        message: 'Olimpíada criada com sucesso',
        olimpiada: novaOlimpiada
      });
      
    } catch (error) {
      return res.status(400).json({
        error: 'Erro ao criar olimpíada',
        details: error.message
      });
    }
  }
  
  /**
   * PUT /api/olimpiadas/:id
   * Atualizar olimpíada
   */
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Dados inválidos',
          details: errors.array() 
        });
      }
      
      const { id } = req.params;
      const olimpiadaData = req.body;
      
      // Verificar se olimpíada existe
      const olimpiadaExistente = await OlimpiadaModel.findById(id);
      if (!olimpiadaExistente) {
        return res.status(404).json({
          error: 'Olimpíada não encontrada'
        });
      }
      
      // Atualizar olimpíada
      await OlimpiadaModel.update(id, olimpiadaData);
      
      // Buscar olimpíada atualizada
      const olimpiadaAtualizada = await OlimpiadaModel.findById(id);
      
      return res.status(200).json({
        success: true,
        message: 'Olimpíada atualizada com sucesso',
        data: olimpiadaAtualizada
      });
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao atualizar olimpíada',
        details: error.message
      });
    }
  }
  
  /**
   * PUT /api/olimpiadas/:id/status
   * Atualizar status da olimpíada
   */
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const statusValidos = [
        'planejamento',
        'inscricoes_abertas',
        'inscricoes_encerradas',
        'realizada',
        'corrigida',
        'finalizada',
        'cancelada'
      ];
      
      if (!statusValidos.includes(status)) {
        return res.status(400).json({
          error: 'Status inválido',
          statusValidos
        });
      }
      
      await OlimpiadaModel.updateStatus(id, status);
      
      const olimpiada = await OlimpiadaModel.findById(id);
      
      return res.status(200).json({
        message: 'Status atualizado com sucesso',
        olimpiada
      });
      
    } catch (error) {
      return res.status(400).json({
        error: 'Erro ao atualizar status',
        details: error.message
      });
    }
  }
  
  /**
   * GET /api/olimpiadas/:id/disciplinas
   * Listar disciplinas de uma olimpíada
   */
  static async getDisciplinas(req, res) {
    try {
      const { id } = req.params;
      
      const disciplinas = await OlimpiadaModel.getDisciplinas(id);
      
      return res.status(200).json({
        total: disciplinas.length,
        disciplinas
      });
      
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar disciplinas',
        details: error.message
      });
    }
  }
  
  /**
   * GET /api/olimpiadas/:id/filiais
   * Listar filiais participantes de uma olimpíada
   */
  static async getFiliais(req, res) {
    try {
      const { id } = req.params;
      
      const filiais = await OlimpiadaModel.getFiliais(id);
      
      return res.status(200).json({
        total: filiais.length,
        filiais
      });
      
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar filiais',
        details: error.message
      });
    }
  }
}

module.exports = OlimpiadaController;
