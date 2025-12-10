const { pool } = require('../config/database');

/**
 * Model para gerenciar Tipos de Correção
 */
class TipoCorrecaoModel {
  
  /**
   * Listar todos os tipos de correção
   */
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM tb_tipo_correcao WHERE 1=1';
    const params = [];
    
    if (filters.ativo) {
      query += ' AND ativo = ?';
      params.push(filters.ativo);
    }
    
    query += ' ORDER BY descricao ASC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }
  
  /**
   * Buscar tipo de correção por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM tb_tipo_correcao WHERE idTipoCorrecao = ?',
      [id]
    );
    return rows[0];
  }
  
  /**
   * Criar novo tipo de correção
   */
  static async create(tipoCorrecaoData) {
    const { descricao, ativo, observacao } = tipoCorrecaoData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_tipo_correcao (descricao, ativo, observacao) 
      VALUES (?, ?, ?)`,
      [descricao, ativo || 'S', observacao || null]
    );
    
    return this.findById(result.insertId);
  }
  
  /**
   * Atualizar tipo de correção
   */
  static async update(id, tipoCorrecaoData) {
    const { descricao, ativo, observacao } = tipoCorrecaoData;
    
    await pool.query(
      `UPDATE tb_tipo_correcao 
      SET descricao = ?, ativo = ?, observacao = ?
      WHERE idTipoCorrecao = ?`,
      [descricao, ativo, observacao, id]
    );
    
    return this.findById(id);
  }
  
  /**
   * Deletar tipo de correção
   */
  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM tb_tipo_correcao WHERE idTipoCorrecao = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
  
  /**
   * Alternar status ativo/inativo
   */
  static async toggleStatus(id) {
    await pool.query(
      `UPDATE tb_tipo_correcao 
      SET ativo = IF(ativo = 'S', 'N', 'S')
      WHERE idTipoCorrecao = ?`,
      [id]
    );
    
    return this.findById(id);
  }
}

module.exports = TipoCorrecaoModel;
