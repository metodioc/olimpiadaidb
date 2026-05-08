const { pool } = require('../config/database');

/**
 * Model para gerenciar Alunos
 */
class AlunoModel {
  
  /**
   * Contar total de alunos com filtros
   */
  static async countAll(filters = {}) {
    const { idTurma, idFilial, idSerie, search, situacao, anoLetivo, turno } = filters;
    
    let query = `
      SELECT COUNT(DISTINCT a.idAluno) as total
      FROM tb_aluno a
      LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
      LEFT JOIN (
        SELECT codPessoa, MAX(nome) as nome
        FROM tb_pessoa
        WHERE codPessoa IS NOT NULL
        GROUP BY codPessoa
      ) p ON a.codPessoa = p.codPessoa
      LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
      LEFT JOIN tb_turma t ON t.codTurma = a.codTurma
        AND t.idAnoLetivo = al.idAnoLetivo
        AND t.idSerie = (
          SELECT s2.idSerie FROM tb_serie s2
          WHERE s2.codSerie = a.codSerie AND s2.idFilial = f.idFilial
          LIMIT 1
        )
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      WHERE 1=1
    `;
    
    const params = [];

    if (anoLetivo) {
      query += ' AND a.anoLetivo = ?';
      params.push(parseInt(anoLetivo));
    } else {
      // fallback: ano letivo ativo
      query += " AND (al.status = 'ativo' OR al.anoLetivo = YEAR(CURDATE()))";
    }
    
    if (idTurma) {
      query += `
        AND a.codTurma = (SELECT tt.codTurma FROM tb_turma tt WHERE tt.idTurma = ?)
        AND a.codSerie = (SELECT s2.codSerie FROM tb_turma tt2
          INNER JOIN tb_serie s2 ON tt2.idSerie = s2.idSerie
          WHERE tt2.idTurma = ?)
        AND CAST(a.codFilial AS UNSIGNED) = (SELECT f2.codFilial FROM tb_turma tt3
          INNER JOIN tb_serie s3 ON tt3.idSerie = s3.idSerie
          INNER JOIN tb_filial f2 ON s3.idFilial = f2.idFilial
          WHERE tt3.idTurma = ?)
        AND a.anoLetivo = (SELECT al2.anoLetivo FROM tb_turma tt4
          INNER JOIN tb_ano_letivo al2 ON tt4.idAnoLetivo = al2.idAnoLetivo
          WHERE tt4.idTurma = ?)
      `;
      params.push(idTurma, idTurma, idTurma, idTurma);
    } else {
      if (idSerie) {
        query += ' AND a.codSerie = (SELECT codSerie FROM tb_serie WHERE idSerie = ?)';
        params.push(idSerie);
      }
      if (idFilial) {
        query += ' AND f.idFilial = ?';
        params.push(idFilial);
      }
    }

    if (turno) {
      query += ' AND t.turno = ?';
      params.push(turno);
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
   * Listar todos os alunos com paginação filtrado por ano letivo
   */
  static async findAll(filters = {}) {
    const { idTurma, idFilial, idSerie, search, situacao, anoLetivo, turno, page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;
    
    // Primeiro, contar o total
    const total = await this.countAll(filters);
    
    // Depois, buscar os registros paginados
    let query = `
      SELECT 
        a.*,
        COALESCE(p.nome, IF(a.codPessoa IS NOT NULL, CONCAT('(Sem cadastro - codPessoa: ', a.codPessoa, ')'), '(Sem vínculo)')) as nome_pessoa,
        p.email,
        p.dtnasc,
        t.turma as turma_nome,
        t.codTurma as codigo_turma,
        t.turno as turno,
        s.serie as serie_nome,
        f.filial as filial_nome,
        al.anoLetivo
      FROM tb_aluno a
      LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
      LEFT JOIN (
        SELECT codPessoa, MAX(nome) as nome, MAX(email) as email, MAX(dtnasc) as dtnasc
        FROM tb_pessoa
        WHERE codPessoa IS NOT NULL
        GROUP BY codPessoa
      ) p ON a.codPessoa = p.codPessoa
      LEFT JOIN tb_filial f ON CAST(a.codFilial AS UNSIGNED) = f.codFilial
      LEFT JOIN tb_turma t ON t.codTurma = a.codTurma
        AND t.idAnoLetivo = al.idAnoLetivo
        AND t.idSerie = (
          SELECT s2.idSerie FROM tb_serie s2
          WHERE s2.codSerie = a.codSerie AND s2.idFilial = f.idFilial
          LIMIT 1
        )
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      WHERE 1=1
    `;
    
    const params = [];

    if (anoLetivo) {
      query += ' AND a.anoLetivo = ?';
      params.push(parseInt(anoLetivo));
    } else {
      query += " AND (al.status = 'ativo' OR al.anoLetivo = YEAR(CURDATE()))";
    }
    
    if (idTurma) {
      query += `
        AND a.codTurma = (SELECT tt.codTurma FROM tb_turma tt WHERE tt.idTurma = ?)
        AND a.codSerie = (SELECT s2.codSerie FROM tb_turma tt2
          INNER JOIN tb_serie s2 ON tt2.idSerie = s2.idSerie
          WHERE tt2.idTurma = ?)
        AND CAST(a.codFilial AS UNSIGNED) = (SELECT f2.codFilial FROM tb_turma tt3
          INNER JOIN tb_serie s3 ON tt3.idSerie = s3.idSerie
          INNER JOIN tb_filial f2 ON s3.idFilial = f2.idFilial
          WHERE tt3.idTurma = ?)
        AND a.anoLetivo = (SELECT al2.anoLetivo FROM tb_turma tt4
          INNER JOIN tb_ano_letivo al2 ON tt4.idAnoLetivo = al2.idAnoLetivo
          WHERE tt4.idTurma = ?)
      `;
      params.push(idTurma, idTurma, idTurma, idTurma);
    } else {
      if (idSerie) {
        query += ' AND a.codSerie = (SELECT codSerie FROM tb_serie WHERE idSerie = ?)';
        params.push(idSerie);
      }
      if (idFilial) {
        query += ' AND f.idFilial = ?';
        params.push(idFilial);
      }
    }

    if (turno) {
      query += ' AND t.turno = ?';
      params.push(turno);
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
    params.push(Number(limit), Number(offset));
    
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
      LEFT JOIN tb_ano_letivo al ON a.anoLetivo = al.anoLetivo
      LEFT JOIN (
        SELECT codPessoa, MAX(nome) as nome, MAX(email) as email, MAX(dtnasc) as dtnasc
        FROM tb_pessoa
        WHERE codPessoa IS NOT NULL
        GROUP BY codPessoa
      ) p ON a.codPessoa = p.codPessoa
      LEFT JOIN (
        SELECT codTurma, idAnoLetivo, MAX(idTurma) as idTurma
        FROM tb_turma
        GROUP BY codTurma, idAnoLetivo
      ) t_map ON a.codTurma = t_map.codTurma AND t_map.idAnoLetivo = al.idAnoLetivo
      LEFT JOIN tb_turma t ON t.idTurma = t_map.idTurma
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
    const {
      ra,
      situacao,
      tipo,
      sistema,
      idGrupoEscola,
      codPessoa,
      codTurma,
      codFilial,
      codSerie,
      anoLetivo
    } = alunoData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_aluno 
        (ra, situacao, tipo, sistema, idGrupoEscola, codPessoa, codTurma, codFilial, codSerie, anoLetivo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ra,
        situacao || 'ativo',
        tipo || 'regular',
        sistema || 'SIEEESP',
        idGrupoEscola || null,
        codPessoa || null,
        codTurma || null,
        codFilial || null,
        codSerie || null,
        anoLetivo || new Date().getFullYear()
      ]
    );
    
    return this.findById(result.insertId);
  }
  
  /**
   * Atualizar aluno
   */
  static async update(id, alunoData) {
    const {
      ra,
      situacao,
      tipo,
      sistema,
      idGrupoEscola,
      codPessoa,
      codTurma,
      codFilial,
      codSerie,
      anoLetivo
    } = alunoData;
    
    await pool.query(
      `UPDATE tb_aluno 
      SET ra = ?, situacao = ?, tipo = ?, sistema = ?, idGrupoEscola = ?, codPessoa = ?, codTurma = ?, codFilial = ?, codSerie = ?, anoLetivo = ?
      WHERE idAluno = ?`,
      [
        ra,
        situacao,
        tipo,
        sistema,
        idGrupoEscola || null,
        codPessoa || null,
        codTurma || null,
        codFilial || null,
        codSerie || null,
        anoLetivo || null,
        id
      ]
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
