const { validationResult } = require('express-validator');
const AlunoModel = require('../models/Aluno.model');

class AlunoController {
  
  static async list(req, res) {
    try {
      const { idTurma, idFilial, search, situacao, page, limit } = req.query;
      const result = await AlunoModel.findAll({ 
        idTurma, 
        idFilial, 
        search,
        situacao,
        page: page || 1,
        limit: limit || 50
      });
      
      res.status(200).json({
        success: true,
        count: result.data.length,
        total: result.pagination.total,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar alunos',
        error: error.message
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const aluno = await AlunoModel.findById(id);
      
      if (!aluno) {
        return res.status(404).json({
          success: false,
          message: 'Aluno não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar aluno',
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
      
      const aluno = await AlunoModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Aluno criado com sucesso',
        data: aluno
      });
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar aluno',
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
      const aluno = await AlunoModel.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Aluno atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar aluno',
        error: error.message
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await AlunoModel.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Aluno deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar aluno',
        error: error.message
      });
    }
  }
}

module.exports = AlunoController;
