const { pool } = require('../config/database');

class LocalAplicacaoModel {
  // Listar todos os locais de aplicação com filtros
  async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          idLocalAplicacao,
          nomeLocal,
          status,
          createdAt,
          updatedAt
        FROM tb_local_aplicacao
        WHERE 1=1
      `;
      const params = [];

      // Filtro por status
      if (filters.status) {
        query += ` AND status = ?`;
        params.push(filters.status);
      }

      // Filtro por nome
      if (filters.search) {
        query += ` AND nomeLocal LIKE ?`;
        params.push(`%${filters.search}%`);
      }

      query += ` ORDER BY nomeLocal ASC`;

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
          idLocalAplicacao,
          nomeLocal,
          status,
          createdAt,
          updatedAt
        FROM tb_local_aplicacao
        WHERE idLocalAplicacao = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Criar novo local
  async create(data) {
    try {
      const [result] = await pool.query(
        `INSERT INTO tb_local_aplicacao (nomeLocal, status)
         VALUES (?, ?)`,
        [data.nomeLocal, data.status || 'ativo']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar local
  async update(id, data) {
    try {
      const [result] = await pool.query(
        `UPDATE tb_local_aplicacao
         SET nomeLocal = ?, status = ?
         WHERE idLocalAplicacao = ?`,
        [data.nomeLocal, data.status, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Deletar local
  async delete(id) {
    try {
      const [result] = await pool.query(
        `DELETE FROM tb_local_aplicacao WHERE idLocalAplicacao = ?`,
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
      let query = `SELECT COUNT(*) as total FROM tb_local_aplicacao WHERE 1=1`;
      const params = [];

      if (filters.status) {
        query += ` AND status = ?`;
        params.push(filters.status);
      }

      if (filters.search) {
        query += ` AND nomeLocal LIKE ?`;
        params.push(`%${filters.search}%`);
      }

      const [rows] = await pool.query(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LocalAplicacaoModel();
