const { validationResult } = require('express-validator');
const TurmaModel = require('../models/Turma.model');

class TurmaController {
  
  static async list(req, res) {
    try {
      const { idFilial, idSerie, idAnoLetivo } = req.query;
      const turmas = await TurmaModel.findAll({ idFilial, idSerie, idAnoLetivo });
      
      res.status(200).json({
        success: true,
        count: turmas.length,
        data: turmas
      });
    } catch (error) {
      console.error('Erro ao listar turmas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar turmas',
        error: error.message
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const turma = await TurmaModel.findById(id);
      
      if (!turma) {
        return res.status(404).json({
          success: false,
          message: 'Turma não encontrada'
        });
      }
      
      const totalAlunos = await TurmaModel.countAlunos(id);
      
      res.status(200).json({
        success: true,
        data: {
          ...turma,
          total_alunos: totalAlunos
        }
      });
    } catch (error) {
      console.error('Erro ao buscar turma:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar turma',
        error: error.message
      });
    }
  }
  
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const turma = await TurmaModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Turma criada com sucesso',
        data: turma
      });
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar turma',
        error: error.message
      });
    }
  }
  
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      await TurmaModel.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Turma atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar turma',
        error: error.message
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await TurmaModel.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Turma deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar turma',
        error: error.message
      });
    }
  }
}

module.exports = TurmaController;
