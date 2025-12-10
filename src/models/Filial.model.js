const { pool } = require('../config/database');

/**
 * Model para gerenciar Filiais
 */
class FilialModel {
  
  /**
   * Listar todas as filiais
   */
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT * FROM tb_filial ORDER BY filial ASC`
    );
    return rows;
  }
  
  /**
   * Buscar filial por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM tb_filial WHERE idFilial = ?',
      [id]
    );
    return rows[0];
  }
  
  /**
   * Criar nova filial
   */
  static async create(filialData) {
    const { codFilial, filial, abFilial } = filialData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_filial (codFilial, filial, abFilial) 
      VALUES (?, ?, ?)`,
      [codFilial, filial, abFilial]
    );
    
    return this.findById(result.insertId);
  }
  
  /**
   * Atualizar filial
   */
  static async update(id, filialData) {
    const { codFilial, filial, abFilial } = filialData;
    
    await pool.query(
      `UPDATE tb_filial 
      SET codFilial = ?, filial = ?, abFilial = ?
      WHERE idFilial = ?`,
      [codFilial, filial, abFilial, id]
    );
    
    return this.findById(id);
  }
  
  /**
   * Deletar filial
   */
  static async delete(id) {
    await pool.query('DELETE FROM tb_filial WHERE idFilial = ?', [id]);
    return true;
  }
}

module.exports = FilialModel;
