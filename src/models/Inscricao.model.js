const { pool } = require('../config/database');

/**
 * Model para gerenciar Inscrições
 */
class InscricaoModel {
  
  /**
   * Listar inscrições com filtros
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        i.*,
        o.nomeOlimpiada,
        o.ano,
        a.ra,
        p.nome AS aluno_nome,
        s.serie,
        t.turma,
        f.filial
      FROM tb_olimpiada_inscricao i
      INNER JOIN tb_olimpiada o ON i.idOlimpiada = o.idOlimpiada
      INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      INNER JOIN tb_turma t ON a.idTurma = t.idTurma
      INNER JOIN tb_serie s ON t.idSerie = s.idSerie
      INNER JOIN tb_filial f ON s.idFilial = f.idFilial
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.idOlimpiada) {
      query += ' AND i.idOlimpiada = ?';
      params.push(filters.idOlimpiada);
    }
    
    if (filters.idAluno) {
      query += ' AND i.idAluno = ?';
      params.push(filters.idAluno);
    }
    
    if (filters.statusInscricao) {
      query += ' AND i.statusInscricao = ?';
      params.push(filters.statusInscricao);
    }
    
    query += ' ORDER BY i.dataInscricao DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }
  
  /**
   * Buscar inscrição por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        i.*,
        o.nomeOlimpiada,
        a.ra,
        p.nome AS aluno_nome
      FROM tb_olimpiada_inscricao i
      INNER JOIN tb_olimpiada o ON i.idOlimpiada = o.idOlimpiada
      INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      WHERE i.idOlimpiadaInscricao = ?`,
      [id]
    );
    return rows[0];
  }
  
  /**
   * Verificar se aluno já está inscrito
   */
  static async isAlreadyEnrolled(idOlimpiada, idAluno) {
    const [rows] = await pool.query(
      'SELECT idOlimpiadaInscricao FROM tb_olimpiada_inscricao WHERE idOlimpiada = ? AND idAluno = ?',
      [idOlimpiada, idAluno]
    );
    return rows.length > 0;
  }
  
  /**
   * Criar inscrição individual
   */
  static async create(inscricaoData) {
    const { idOlimpiada, idAluno, statusInscricao, observacoes } = inscricaoData;
    
    // Verificar se já está inscrito
    const jaInscrito = await this.isAlreadyEnrolled(idOlimpiada, idAluno);
    if (jaInscrito) {
      throw new Error('Aluno já está inscrito nesta olimpíada');
    }
    
    const [result] = await pool.query(
      `INSERT INTO tb_olimpiada_inscricao 
        (idOlimpiada, idAluno, statusInscricao, observacoes) 
      VALUES (?, ?, ?, ?)`,
      [idOlimpiada, idAluno, statusInscricao || 'inscrito', observacoes]
    );
    
    return result.insertId;
  }
  
  /**
   * Inscrição em lote (vários alunos)
   */
  static async createBatch(idOlimpiada, alunosIds, statusInscricao = 'inscrito') {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const inscricoes = [];
      const erros = [];
      
      for (const idAluno of alunosIds) {
        try {
          // Verificar se já está inscrito
          const [existing] = await connection.query(
            'SELECT idOlimpiadaInscricao FROM tb_olimpiada_inscricao WHERE idOlimpiada = ? AND idAluno = ?',
            [idOlimpiada, idAluno]
          );
          
          if (existing.length > 0) {
            erros.push({ idAluno, erro: 'Já inscrito' });
            continue;
          }
          
          // Criar inscrição
          const [result] = await connection.query(
            `INSERT INTO tb_olimpiada_inscricao 
              (idOlimpiada, idAluno, statusInscricao) 
            VALUES (?, ?, ?)`,
            [idOlimpiada, idAluno, statusInscricao]
          );
          
          inscricoes.push({ idAluno, idInscricao: result.insertId });
          
        } catch (error) {
          erros.push({ idAluno, erro: error.message });
        }
      }
      
      await connection.commit();
      
      return { inscricoes, erros };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  /**
   * Inscrever todos os alunos de uma turma
   */
  static async enrollByTurma(idOlimpiada, idTurma) {
    const [alunos] = await pool.query(
      `SELECT a.idAluno 
      FROM tb_aluno a
      INNER JOIN tb_turma t ON a.idTurma = t.idTurma
      INNER JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
      WHERE a.idTurma = ? AND a.situacao = "Matriculado" AND al.status = "ativo"`,
      [idTurma]
    );
    
    const alunosIds = alunos.map(a => a.idAluno);
    return await this.createBatch(idOlimpiada, alunosIds);
  }
  
  /**
   * Inscrever todos os alunos de uma série
   */
  static async enrollBySerie(idOlimpiada, idSerie, idFilial) {
    const [alunos] = await pool.query(
      `SELECT a.idAluno 
      FROM tb_aluno a
      INNER JOIN tb_turma t ON a.idTurma = t.idTurma
      INNER JOIN tb_serie s ON t.idSerie = s.idSerie
      INNER JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
      WHERE s.idSerie = ? AND s.idFilial = ? AND a.situacao = "Matriculado" AND al.status = "ativo"`,
      [idSerie, idFilial]
    );
    
    const alunosIds = alunos.map(a => a.idAluno);
    return await this.createBatch(idOlimpiada, alunosIds);
  }
  
  /**
   * Deletar múltiplas inscrições
   */
  static async deleteBatch(ids) {
    if (!ids || ids.length === 0) return 0;

    const placeholders = ids.map(() => '?').join(',');
    const [result] = await pool.query(
      `DELETE FROM tb_olimpiada_inscricao WHERE idOlimpiadaInscricao IN (${placeholders})`,
      ids
    );
    return result.affectedRows;
  }
  
  /**
   * Atualizar status da inscrição
   */
  static async updateStatus(id, novoStatus) {
    await pool.query(
      'UPDATE tb_olimpiada_inscricao SET statusInscricao = ? WHERE idOlimpiadaInscricao = ?',
      [novoStatus, id]
    );
  }
  
  /**
   * Cancelar inscrição
   */
  static async cancel(id) {
    await this.updateStatus(id, 'cancelado');
  }
  
  /**
   * Contar inscrições por olimpíada
   */
  static async countByOlimpiada(idOlimpiada) {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statusInscricao = 'inscrito' THEN 1 ELSE 0 END) as inscritos,
        SUM(CASE WHEN statusInscricao = 'confirmado' THEN 1 ELSE 0 END) as confirmados,
        SUM(CASE WHEN statusInscricao = 'presente' THEN 1 ELSE 0 END) as presentes,
        SUM(CASE WHEN statusInscricao = 'ausente' THEN 1 ELSE 0 END) as ausentes
      FROM tb_olimpiada_inscricao 
      WHERE idOlimpiada = ?`,
      [idOlimpiada]
    );
    return rows[0];
  }
}

module.exports = InscricaoModel;
