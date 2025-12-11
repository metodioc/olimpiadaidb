const { pool } = require('../config/database');

/**
 * Model para gerenciar Alunos
 */
class AlunoModel {
  
  /**
   * Contar total de alunos com filtros
   */
  static async countAll(filters = {}) {
    const { idTurma, idFilial, idSerie, search, situacao } = filters;
    
    let query = `
      SELECT COUNT(*) as total
      FROM tb_aluno a
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
      LEFT JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
      WHERE (al.status = 'ativo' OR al.status IS NULL)
    `;
    
    const params = [];
    
    if (idTurma) {
      query += ' AND a.idTurma = ?';
      params.push(idTurma);
    }
    
    if (idSerie) {
      query += ' AND s.idSerie = ?';
      params.push(idSerie);
    }
    
    if (idFilial) {
      query += ' AND s.idFilial = ?';
      params.push(idFilial);
    }
    
    if (situacao) {
      query += ' AND a.situacao = ?';
      params.push(situacao);
    }
    
    if (search) {
      query += ' AND (p.nome LIKE ? OR a.ra LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  /**
   * Listar todos os alunos com paginação e filtro por ano letivo ativo
   */
  static async findAll(filters = {}) {
    const { idTurma, idFilial, idSerie, search, situacao, page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;
    
    // Primeiro, contar o total
    const total = await this.countAll(filters);
    
    // Depois, buscar os registros paginados
    let query = `
      SELECT 
        a.*,
        p.nome as nome_pessoa,
        p.email,
        p.dtnasc,
        t.turma as turma_nome,
        t.codTurma as codigo_turma,
        s.serie as serie_nome,
        f.filial as filial_nome,
        al.anoLetivo
      FROM tb_aluno a
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
      LEFT JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
      WHERE (al.status = 'ativo' OR al.status IS NULL)
    `;
    
    const params = [];
    
    if (idTurma) {
      query += ' AND a.idTurma = ?';
      params.push(idTurma);
    }
    
    if (idSerie) {
      query += ' AND s.idSerie = ?';
      params.push(idSerie);
    }
    
    if (idFilial) {
      query += ' AND s.idFilial = ?';
      params.push(idFilial);
    }
    
    if (situacao) {
      query += ' AND a.situacao = ?';
      params.push(situacao);
    }
    
    if (search) {
      query += ' AND (p.nome LIKE ? OR a.ra LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY p.nome ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await pool.query(query, params);
    
    return {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  /**
   * Buscar aluno por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        a.*,
        p.nome as nome_pessoa,
        p.email,
        p.dtnasc,
        t.turma as turma_nome,
        t.codTurma as codigo_turma,
        s.serie as serie_nome,
        f.filial as filial_nome
      FROM tb_aluno a
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
      WHERE a.idAluno = ?`,
      [id]
    );
    return rows[0];
  }
  
  /**
   * Criar novo aluno
   */
  static async create(alunoData) {
    const { ra, situacao, tipo, sistema, idGrupoEscola, idPessoa, idTurma } = alunoData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_aluno 
        (ra, situacao, tipo, sistema, idGrupoEscola, idPessoa, idTurma) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ra, situacao || 'ativo', tipo || 'regular', sistema || 'SIEEESP', idGrupoEscola || null, idPessoa, idTurma]
    );
    
    return this.findById(result.insertId);
  }
  
  /**
   * Atualizar aluno
   */
  static async update(id, alunoData) {
    const { ra, situacao, tipo, sistema, idGrupoEscola, idTurma } = alunoData;
    
    await pool.query(
      `UPDATE tb_aluno 
      SET ra = ?, situacao = ?, tipo = ?, sistema = ?, idGrupoEscola = ?, idTurma = ?
      WHERE idAluno = ?`,
      [ra, situacao, tipo, sistema, idGrupoEscola || null, idTurma, id]
    );
    
    return this.findById(id);
  }
  
  /**
   * Deletar aluno
   */
  static async delete(id) {
    await pool.query('DELETE FROM tb_aluno WHERE idAluno = ?', [id]);
    return true;
  }
}

module.exports = AlunoModel;
