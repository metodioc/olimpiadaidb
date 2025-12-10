const LocalAplicacaoModel = require('../models/LocalAplicacao.model');
const { validationResult } = require('express-validator');

class LocalAplicacaoController {
  // Listar locais
  async list(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search
      };

      const locais = await LocalAplicacaoModel.findAll(filters);
      const total = await LocalAplicacaoModel.countAll(filters);

      res.status(200).json({
        success: true,
        count: locais.length,
        total,
        data: locais
      });
    } catch (error) {
      console.error('Erro ao listar locais de aplicação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar locais de aplicação',
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
      const local = await LocalAplicacaoModel.findById(id);

      if (!local) {
        return res.status(404).json({
          success: false,
          message: 'Local de aplicação não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: local
      });
    } catch (error) {
      console.error('Erro ao buscar local de aplicação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar local de aplicação',
        error: error.message
      });
    }
  }

  // Criar novo local
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { nomeLocal, status } = req.body;

      const id = await LocalAplicacaoModel.create({ nomeLocal, status });

      res.status(201).json({
        success: true,
        message: 'Local de aplicação criado com sucesso',
        data: {
          idLocalAplicacao: id,
          nomeLocal,
          status: status || 'ativo'
        }
      });
    } catch (error) {
      console.error('Erro ao criar local de aplicação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar local de aplicação',
        error: error.message
      });
    }
  }

  // Atualizar local
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
      const { nomeLocal, status } = req.body;

      const affectedRows = await LocalAplicacaoModel.update(id, { nomeLocal, status });

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Local de aplicação não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Local de aplicação atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar local de aplicação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar local de aplicação',
        error: error.message
      });
    }
  }

  // Deletar local
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

      const affectedRows = await LocalAplicacaoModel.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Local de aplicação não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Local de aplicação deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar local de aplicação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar local de aplicação',
        error: error.message
      });
    }
  }
}

module.exports = new LocalAplicacaoController();
