const { validationResult } = require('express-validator');
const TipoCorrecaoModel = require('../models/TipoCorrecao.model');

class TipoCorrecaoController {
  
  static async list(req, res) {
    try {
      const { ativo } = req.query;
      const filters = {};
      
      if (ativo) {
        filters.ativo = ativo;
      }
      
      const tiposCorrecao = await TipoCorrecaoModel.findAll(filters);
      
      return res.status(200).json({
        total: tiposCorrecao.length,
        data: tiposCorrecao
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar tipos de correção',
        details: error.message
      });
    }
  }
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const tipoCorrecao = await TipoCorrecaoModel.findById(id);
      
      if (!tipoCorrecao) {
        return res.status(404).json({ error: 'Tipo de correção não encontrado' });
      }
      
      return res.status(200).json({ tipoCorrecao });
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar tipo de correção',
        details: error.message
      });
    }
  }
  
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Dados inválidos',
          details: errors.array() 
        });
      }
      
      const tipoCorrecao = await TipoCorrecaoModel.create(req.body);
      
      return res.status(201).json({
        message: 'Tipo de correção criado com sucesso',
        tipoCorrecao
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Erro ao criar tipo de correção',
        details: error.message
      });
    }
  }
  
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
      const tipoCorrecao = await TipoCorrecaoModel.update(id, req.body);
      
      return res.status(200).json({
        message: 'Tipo de correção atualizado com sucesso',
        tipoCorrecao
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Erro ao atualizar tipo de correção',
        details: error.message
      });
    }
  }
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await TipoCorrecaoModel.delete(id);
      
      return res.status(200).json({
        message: 'Tipo de correção deletado com sucesso'
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Erro ao deletar tipo de correção',
        details: error.message
      });
    }
  }
  
  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const tipoCorrecao = await TipoCorrecaoModel.toggleStatus(id);
      
      return res.status(200).json({
        message: 'Status alterado com sucesso',
        tipoCorrecao
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Erro ao alterar status',
        details: error.message
      });
    }
  }
}

module.exports = TipoCorrecaoController;
