const { pool } = require('../config/database');

class TipoOlimpiadaModel {

  static async findAll(filters = {}) {
    let query = `
      SELECT t.*,
        (SELECT COUNT(*) FROM tb_olimpiada o WHERE o.idTipoOlimpiada = t.idTipoOlimpiada) AS totalOlimpiadas
      FROM tb_tipo_olimpiada t
      WHERE 1=1
    `;
    const params = [];

    if (filters.ativo !== undefined && filters.ativo !== '') {
      query += ' AND t.ativo = ?';
      params.push(filters.ativo);
    }
    if (filters.search) {
      query += ' AND (t.nomeOlimpiada LIKE ? OR t.abreviacao LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY t.nomeOlimpiada';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM tb_tipo_olimpiada WHERE idTipoOlimpiada = ?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const { nomeOlimpiada, abreviacao, descricao, ativo = 1 } = data;
    const [result] = await pool.query(
      `INSERT INTO tb_tipo_olimpiada (nomeOlimpiada, abreviacao, descricao, ativo)
       VALUES (?, ?, ?, ?)`,
      [nomeOlimpiada, abreviacao, descricao || null, ativo]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { nomeOlimpiada, abreviacao, descricao, ativo } = data;
    const [result] = await pool.query(
      `UPDATE tb_tipo_olimpiada SET
        nomeOlimpiada = COALESCE(?, nomeOlimpiada),
        abreviacao    = COALESCE(?, abreviacao),
        descricao     = ?,
        ativo         = COALESCE(?, ativo)
       WHERE idTipoOlimpiada = ?`,
      [nomeOlimpiada || null, abreviacao || null, descricao !== undefined ? descricao : undefined, ativo !== undefined ? ativo : null, id]
    );
    return result.affectedRows;
  }
}

module.exports = TipoOlimpiadaModel;
