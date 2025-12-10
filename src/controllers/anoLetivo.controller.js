const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

class AnoLetivoController {
  // Listar todos os anos letivos
  async list(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          idAnoLetivo,
          anoLetivo,
          status,
          createdAt,
          updatedAt
        FROM tb_ano_letivo
        ORDER BY anoLetivo DESC
      `);

      res.status(200).json({
        success: true,
        count: rows.length,
        data: rows
      });
    } catch (error) {
      console.error('Erro ao listar anos letivos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar anos letivos',
        error: error.message
      });
    }
  }

  // Buscar ano letivo por ID
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

      const [rows] = await pool.query(`
        SELECT 
          idAnoLetivo,
          anoLetivo,
          status,
          createdAt,
          updatedAt
        FROM tb_ano_letivo
        WHERE idAnoLetivo = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Ano letivo não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Erro ao buscar ano letivo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar ano letivo',
        error: error.message
      });
    }
  }

  // Criar novo ano letivo
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { anoLetivo, status } = req.body;

      const [result] = await pool.query(`
        INSERT INTO tb_ano_letivo (anoLetivo, status)
        VALUES (?, ?)
      `, [anoLetivo, status || 'ativo']);

      res.status(201).json({
        success: true,
        message: 'Ano letivo criado com sucesso',
        data: {
          idAnoLetivo: result.insertId,
          anoLetivo,
          status: status || 'ativo'
        }
      });
    } catch (error) {
      console.error('Erro ao criar ano letivo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar ano letivo',
        error: error.message
      });
    }
  }

  // Atualizar ano letivo
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
      const { anoLetivo, status } = req.body;

      const [result] = await pool.query(`
        UPDATE tb_ano_letivo
        SET anoLetivo = ?, status = ?
        WHERE idAnoLetivo = ?
      `, [anoLetivo, status, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Ano letivo não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Ano letivo atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar ano letivo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar ano letivo',
        error: error.message
      });
    }
  }

  // Deletar ano letivo
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

      const [result] = await pool.query(`
        DELETE FROM tb_ano_letivo
        WHERE idAnoLetivo = ?
      `, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Ano letivo não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Ano letivo deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar ano letivo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar ano letivo',
        error: error.message
      });
    }
  }
}

module.exports = new AnoLetivoController();
