const { validationResult } = require('express-validator');
const FilialModel = require('../models/Filial.model');

class FilialController {
  
  static async list(req, res) {
    try {
      const filiais = await FilialModel.findAll();
      res.status(200).json({
        success: true,
        count: filiais.length,
        data: filiais
      });
    } catch (error) {
      console.error('Erro ao listar filiais:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar filiais',
        error: error.message
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const filial = await FilialModel.findById(id);
      
      if (!filial) {
        return res.status(404).json({
          success: false,
          message: 'Filial não encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: filial
      });
    } catch (error) {
      console.error('Erro ao buscar filial:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar filial',
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
      
      const filial = await FilialModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Filial criada com sucesso',
        data: filial
      });
    } catch (error) {
      console.error('Erro ao criar filial:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar filial',
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
      await FilialModel.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Filial atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar filial:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar filial',
        error: error.message
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await FilialModel.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Filial deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar filial:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar filial',
        error: error.message
      });
    }
  }
}

module.exports = FilialController;
