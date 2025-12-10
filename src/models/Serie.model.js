const { pool } = require('../config/database');

/**
 * Model para gerenciar Séries
 */
class SerieModel {
  
  /**
   * Listar todas as séries
   */
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT s.*, f.filial, f.abFilial 
       FROM tb_serie s 
       LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
       ORDER BY s.idSerie ASC`
    );
    return rows;
  }
  
  /**
   * Buscar série por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, f.filial, f.abFilial 
       FROM tb_serie s 
       LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
       WHERE s.idSerie = ?`,
      [id]
    );
    return rows[0];
  }
  
  /**
   * Criar nova série
   */
  static async create(serieData) {
    const { codSerie, abSerie, serie, idFilial } = serieData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_serie (codSerie, abSerie, serie, idFilial) 
      VALUES (?, ?, ?, ?)`,
      [codSerie, abSerie, serie, idFilial]
    );
    
    return this.findById(result.insertId);
  }
  
  /**
   * Atualizar série
   */
  static async update(id, serieData) {
    const { codSerie, abSerie, serie, idFilial } = serieData;
    
    await pool.query(
      `UPDATE tb_serie 
      SET codSerie = ?, abSerie = ?, serie = ?, idFilial = ?
      WHERE idSerie = ?`,
      [codSerie, abSerie, serie, idFilial, id]
    );
    
    return this.findById(id);
  }
  
  /**
   * Deletar série
   */
  static async delete(id) {
    await pool.query('DELETE FROM tb_serie WHERE idSerie = ?', [id]);
    return true;
  }
}

module.exports = SerieModel;
