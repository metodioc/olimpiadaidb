const { pool } = require('../config/database');

/**
 * Model para gerenciar Turmas
 */
class TurmaModel {
  
  /**
   * Listar todas as turmas
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        t.*,
        s.serie as serie_nome,
        s.abSerie as serie_abreviacao,
        f.filial as filial_nome,
        f.abFilial as filial_abreviacao,
        a.anoLetivo as ano_letivo,
        CONCAT(s.abSerie, ' - ', t.turma) as nome_turma
      FROM tb_turma t
      INNER JOIN tb_serie s ON t.idSerie = s.idSerie
      INNER JOIN tb_filial f ON s.idFilial = f.idFilial
      INNER JOIN tb_ano_letivo a ON t.idAnoLetivo = a.idAnoLetivo
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.idFilial) {
      query += ' AND s.idFilial = ?';
      params.push(filters.idFilial);
    }
    
    if (filters.idSerie) {
      query += ' AND t.idSerie = ?';
      params.push(filters.idSerie);
    }
    
    if (filters.idAnoLetivo) {
      query += ' AND t.idAnoLetivo = ?';
      params.push(filters.idAnoLetivo);
    }
    
    query += ' ORDER BY f.filial, s.serie, t.turma ASC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }
  
  /**
   * Buscar turma por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        t.*,
        s.idSerie,
        s.serie as serie_nome,
        s.abSerie as serie_abreviacao,
        f.idFilial,
        f.filial as filial_nome,
        f.abFilial as filial_abreviacao,
        a.anoLetivo as ano_letivo,
        CONCAT(s.abSerie, ' - ', t.turma) as nome_turma
      FROM tb_turma t
      INNER JOIN tb_serie s ON t.idSerie = s.idSerie
      INNER JOIN tb_filial f ON s.idFilial = f.idFilial
      INNER JOIN tb_ano_letivo a ON t.idAnoLetivo = a.idAnoLetivo
      WHERE t.idTurma = ?`,
      [id]
    );
    return rows[0];
  }
  
  /**
   * Criar nova turma
   */
  static async create(turmaData) {
    const { codTurma, turma, idSerie, idAnoLetivo, turno } = turmaData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_turma 
        (codTurma, turma, idSerie, idAnoLetivo, turno) 
      VALUES (?, ?, ?, ?, ?)`,
      [codTurma, turma, idSerie, idAnoLetivo, turno || null]
    );
    
    return this.findById(result.insertId);
  }
  
  /**
   * Atualizar turma
   */
  static async update(id, turmaData) {
    const { codTurma, turma, idSerie, idAnoLetivo, turno } = turmaData;
    
    await pool.query(
      `UPDATE tb_turma 
      SET codTurma = ?, turma = ?, idSerie = ?, idAnoLetivo = ?, turno = ?
      WHERE idTurma = ?`,
      [codTurma, turma, idSerie, idAnoLetivo, turno || null, id]
    );
    
    return this.findById(id);
  }
  
  /**
   * Deletar turma
   */
  static async delete(id) {
    await pool.query('DELETE FROM tb_turma WHERE idTurma = ?', [id]);
    return true;
  }
  
  /**
   * Contar alunos na turma
   */
  static async countAlunos(id) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as total FROM tb_aluno WHERE idTurma = ?',
      [id]
    );
    return rows[0].total;
  }
}

module.exports = TurmaModel;
