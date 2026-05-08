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
        CONCAT(s.abSerie, ' - ', t.turma) as nome_turma,
        (
          SELECT COUNT(*)
          FROM tb_aluno al
          WHERE al.codTurma = t.codTurma
            AND al.anoLetivo = a.anoLetivo
            AND CAST(al.codFilial AS UNSIGNED) = f.codFilial
            AND al.situacao = 'Matriculado'
        ) as totalAlunos
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

    if (filters.anoLetivo) {
      query += ' AND a.anoLetivo = ?';
      params.push(filters.anoLetivo);
    }

    if (filters.turno) {
      query += ' AND t.turno = ?';
      params.push(filters.turno);
    }
    
    query += ' ORDER BY t.codTurma ASC';
    
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
      `SELECT COUNT(*) as total
       FROM tb_aluno a
       WHERE a.codTurma = (SELECT tt.codTurma FROM tb_turma tt WHERE tt.idTurma = ?)
         AND CAST(a.codFilial AS UNSIGNED) = (SELECT f.codFilial FROM tb_turma tt2
           INNER JOIN tb_serie s ON tt2.idSerie = s.idSerie
           INNER JOIN tb_filial f ON s.idFilial = f.idFilial
           WHERE tt2.idTurma = ?)
         AND a.anoLetivo = (SELECT al.anoLetivo FROM tb_turma tt3
           INNER JOIN tb_ano_letivo al ON tt3.idAnoLetivo = al.idAnoLetivo
           WHERE tt3.idTurma = ?)`,
      [id, id, id]
    );
    return rows[0].total;
  }
}

module.exports = TurmaModel;
