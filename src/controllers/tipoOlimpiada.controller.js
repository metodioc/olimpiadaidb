const TipoOlimpiadaModel = require('../models/TipoOlimpiada.model');
const { validationResult } = require('express-validator');

class TipoOlimpiadaController {

  static async list(req, res) {
    try {
      const { ativo, search } = req.query;
      const tipos = await TipoOlimpiadaModel.findAll({ ativo, search });
      return res.json({ success: true, total: tipos.length, data: tipos });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Erro ao listar tipos de olimpíada', details: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const tipo = await TipoOlimpiadaModel.findById(req.params.id);
      if (!tipo) return res.status(404).json({ error: 'Tipo de olimpíada não encontrado' });
      return res.json({ success: true, data: tipo });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar tipo de olimpíada', details: error.message });
    }
  }

  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });

      const id = await TipoOlimpiadaModel.create(req.body);
      const novo = await TipoOlimpiadaModel.findById(id);
      return res.status(201).json({ success: true, message: 'Tipo de olimpíada criado com sucesso', data: novo });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Abreviação já cadastrada' });
      }
      return res.status(400).json({ error: 'Erro ao criar tipo de olimpíada', details: error.message });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });

      const rows = await TipoOlimpiadaModel.update(req.params.id, req.body);
      if (rows === 0) return res.status(404).json({ error: 'Tipo de olimpíada não encontrado' });
      const atualizado = await TipoOlimpiadaModel.findById(req.params.id);
      return res.json({ success: true, message: 'Atualizado com sucesso', data: atualizado });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar', details: error.message });
    }
  }
}

module.exports = TipoOlimpiadaController;
