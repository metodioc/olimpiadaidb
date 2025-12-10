const TipoPagamentoModel = require('../models/TipoPagamento.model');
const { validationResult } = require('express-validator');

class TipoPagamentoController {
  // Listar tipos
  async list(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search
      };

      const tipos = await TipoPagamentoModel.findAll(filters);
      const total = await TipoPagamentoModel.countAll(filters);

      res.status(200).json({
        success: true,
        count: tipos.length,
        total,
        data: tipos
      });
    } catch (error) {
      console.error('Erro ao listar tipos de pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar tipos de pagamento',
        error: error.message
      });
    }
  }

  // Buscar por ID
  async getById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const tipo = await TipoPagamentoModel.findById(id);

      if (!tipo) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de pagamento não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: tipo
      });
    } catch (error) {
      console.error('Erro ao buscar tipo de pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar tipo de pagamento',
        error: error.message
      });
    }
  }

  // Criar novo tipo
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { descricao, status } = req.body;

      const id = await TipoPagamentoModel.create({ descricao, status });

      res.status(201).json({
        success: true,
        message: 'Tipo de pagamento criado com sucesso',
        data: {
          idTipoPagamento: id,
          descricao,
          status: status || 'ativo'
        }
      });
    } catch (error) {
      console.error('Erro ao criar tipo de pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar tipo de pagamento',
        error: error.message
      });
    }
  }

  // Atualizar tipo
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { descricao, status } = req.body;

      const affectedRows = await TipoPagamentoModel.update(id, { descricao, status });

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de pagamento não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Tipo de pagamento atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar tipo de pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar tipo de pagamento',
        error: error.message
      });
    }
  }

  // Deletar tipo
  async delete(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;

      const affectedRows = await TipoPagamentoModel.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de pagamento não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Tipo de pagamento deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar tipo de pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar tipo de pagamento',
        error: error.message
      });
    }
  }
}

module.exports = new TipoPagamentoController();
