const { validationResult } = require('express-validator');
const SerieModel = require('../models/Serie.model');

class SerieController {
  
  static async list(req, res) {
    try {
      const series = await SerieModel.findAll();
      res.status(200).json({
        success: true,
        count: series.length,
        data: series
      });
    } catch (error) {
      console.error('Erro ao listar séries:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar séries',
        error: error.message
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const serie = await SerieModel.findById(id);
      
      if (!serie) {
        return res.status(404).json({
          success: false,
          message: 'Série não encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: serie
      });
    } catch (error) {
      console.error('Erro ao buscar série:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar série',
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
      
      const serie = await SerieModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Série criada com sucesso',
        data: serie
      });
    } catch (error) {
      console.error('Erro ao criar série:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar série',
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
      await SerieModel.update(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Série atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar série:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar série',
        error: error.message
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await SerieModel.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Série deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar série:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar série',
        error: error.message
      });
    }
  }
}

module.exports = SerieController;
