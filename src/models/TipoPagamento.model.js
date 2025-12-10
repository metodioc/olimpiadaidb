const { pool } = require('../config/database');

class TipoPagamentoModel {
  // Listar todos os tipos de pagamento com filtros
  async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          idTipoPagamento,
          descricao,
          status,
          createdAt,
          updatedAt
        FROM tb_tipo_pagamento
        WHERE 1=1
      `;
      const params = [];

      // Filtro por status
      if (filters.status) {
        query += ` AND status = ?`;
        params.push(filters.status);
      }

      // Filtro por descrição
      if (filters.search) {
        query += ` AND descricao LIKE ?`;
        params.push(`%${filters.search}%`);
      }

      query += ` ORDER BY descricao ASC`;

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar por ID
  async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          idTipoPagamento,
          descricao,
          status,
          createdAt,
          updatedAt
        FROM tb_tipo_pagamento
        WHERE idTipoPagamento = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Criar novo tipo
  async create(data) {
    try {
      const [result] = await pool.query(
        `INSERT INTO tb_tipo_pagamento (descricao, status)
         VALUES (?, ?)`,
        [data.descricao, data.status || 'ativo']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar tipo
  async update(id, data) {
    try {
      const [result] = await pool.query(
        `UPDATE tb_tipo_pagamento
         SET descricao = ?, status = ?
         WHERE idTipoPagamento = ?`,
        [data.descricao, data.status, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Deletar tipo
  async delete(id) {
    try {
      const [result] = await pool.query(
        `DELETE FROM tb_tipo_pagamento WHERE idTipoPagamento = ?`,
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Contar total
  async countAll(filters = {}) {
    try {
      let query = `SELECT COUNT(*) as total FROM tb_tipo_pagamento WHERE 1=1`;
      const params = [];

      if (filters.status) {
        query += ` AND status = ?`;
        params.push(filters.status);
      }

      if (filters.search) {
        query += ` AND descricao LIKE ?`;
        params.push(`%${filters.search}%`);
      }

      const [rows] = await pool.query(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TipoPagamentoModel();
