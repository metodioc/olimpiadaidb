const { pool } = require('../config/database');

class Resultado {
  /**
   * Lista resultados com filtros
   * @param {Object} filters - Filtros (idOlimpiada, idAluno, idTipoMedalha)
   * @returns {Promise<Array>}
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        r.idOlimpiadaResultado,
        r.idOlimpiadaInscricao,
        r.idTipoMedalha,
        r.pontuacao,
        r.classificacao,
        r.observacoes,
        r.dataRegistro,
        i.idOlimpiada,
        i.idAluno,
        o.nomeOlimpiada,
        o.ano,
        p.nome AS nome_aluno,
        a.ra,
        tm.tipoMedalha,
        t.turma,
        s.serie,
        f.filial
      FROM tb_olimpiada_resultado r
      INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
      INNER JOIN tb_olimpiada o ON i.idOlimpiada = o.idOlimpiada
      INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
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
    
    if (filters.idTipoMedalha) {
      query += ' AND r.idTipoMedalha = ?';
      params.push(filters.idTipoMedalha);
    }
    
    query += ' ORDER BY r.classificacao ASC, r.pontuacao DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Busca resultado por ID
   * @param {number} id - ID do resultado
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const query = `
      SELECT 
        r.idOlimpiadaResultado,
        r.idOlimpiadaInscricao,
        r.idTipoMedalha,
        r.pontuacao,
        r.classificacao,
        r.observacoes,
        r.dataRegistro,
        i.idOlimpiada,
        i.idAluno,
        o.nomeOlimpiada,
        o.ano,
        p.nome AS nome_aluno,
        a.ra,
        tm.tipoMedalha,
        t.turma,
        s.serie,
        f.filial
      FROM tb_olimpiada_resultado r
      INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
      INNER JOIN tb_olimpiada o ON i.idOlimpiada = o.idOlimpiada
      INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
      WHERE r.idOlimpiadaResultado = ?
    `;
    
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  /**
   * Cria um novo resultado
   * @param {Object} resultadoData - Dados do resultado
   * @returns {Promise<Object>}
   */
  static async create(resultadoData) {
    const { idOlimpiadaInscricao, pontuacao, idTipoMedalha, observacoes } = resultadoData;
    
    const query = `
      INSERT INTO tb_olimpiada_resultado 
      (idOlimpiadaInscricao, pontuacao, idTipoMedalha, observacoes)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      idOlimpiadaInscricao,
      pontuacao,
      idTipoMedalha || null,
      observacoes || null
    ]);
    
    return this.findById(result.insertId);
  }

  /**
   * Lança resultados em lote
   * @param {Array} resultados - Array de objetos com idOlimpiadaInscricao, pontuacao
   * @returns {Promise<Object>}
   */
  static async createBatch(resultados) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const insertedIds = [];
      
      for (const resultado of resultados) {
        const query = `
          INSERT INTO tb_olimpiada_resultado 
          (idOlimpiadaInscricao, pontuacao, idTipoMedalha, observacoes)
          VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await connection.query(query, [
          resultado.idOlimpiadaInscricao,
          resultado.pontuacao,
          resultado.idTipoMedalha || null,
          resultado.observacoes || null
        ]);
        
        insertedIds.push(result.insertId);
      }
      
      await connection.commit();
      
      return {
        success: true,
        message: `${insertedIds.length} resultados lançados com sucesso`,
        insertedIds
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Atualiza um resultado
   * @param {number} id - ID do resultado
   * @param {Object} resultadoData - Dados atualizados
   * @returns {Promise<Object>}
   */
  static async update(id, resultadoData) {
    const { pontuacao, idTipoMedalha, observacoes } = resultadoData;
    
    const query = `
      UPDATE tb_olimpiada_resultado 
      SET pontuacao = ?, idTipoMedalha = ?, observacoes = ?
      WHERE idOlimpiadaResultado = ?
    `;
    
    await pool.query(query, [
      pontuacao,
      idTipoMedalha || null,
      observacoes || null,
      id
    ]);
    
    return this.findById(id);
  }

  /**
   * Remove um resultado
   * @param {number} id - ID do resultado
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const query = 'DELETE FROM tb_olimpiada_resultado WHERE idOlimpiadaResultado = ?';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Calcula ranking geral de uma olimpíada
   * @param {number} idOlimpiada - ID da olimpíada
   * @returns {Promise<Array>}
   */
  static async getRankingGeral(idOlimpiada) {
    const query = `
      SELECT 
        @rank := @rank + 1 AS posicao,
        p.nome AS nome_aluno,
        a.ra,
        r.pontuacao,
        t.turma,
        s.serie,
        f.filial,
        r.idTipoMedalha,
        tm.tipoMedalha
      FROM tb_olimpiada_resultado r
      INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
      INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
      LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha,
      (SELECT @rank := 0) AS r_init
      WHERE i.idOlimpiada = ?
      ORDER BY r.pontuacao DESC, p.nome ASC
    `;
    
    const [rows] = await pool.query(query, [idOlimpiada]);
    return rows;
  }

  /**
   * Calcula ranking por série
   * @param {number} idOlimpiada - ID da olimpíada
   * @param {number} idSerie - ID da série
   * @returns {Promise<Array>}
   */
  static async getRankingPorSerie(idOlimpiada, idSerie) {
    const query = `
      SELECT 
        @rank := @rank + 1 AS posicao,
        p.nome AS nome_aluno,
        a.ra,
        r.pontuacao,
        t.turma,
        s.serie,
        f.filial,
        r.idTipoMedalha,
        tm.tipoMedalha
      FROM tb_olimpiada_resultado r
      INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
      INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
      LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha,
      (SELECT @rank := 0) AS r_init
      WHERE i.idOlimpiada = ? AND s.idSerie = ?
      ORDER BY r.pontuacao DESC, p.nome ASC
    `;
    
    const [rows] = await pool.query(query, [idOlimpiada, idSerie]);
    return rows;
  }

  /**
   * Lista medalhistas de uma olimpíada
   * @param {number} idOlimpiada - ID da olimpíada
   * @returns {Promise<Array>}
   */
  static async getMedalhistas(idOlimpiada) {
    const query = `
      SELECT 
        p.nome AS nome_aluno,
        a.ra,
        r.pontuacao,
        tm.tipoMedalha,
        tm.descricao AS tipo_medalha,
        s.serie,
        f.filial
      FROM tb_olimpiada_resultado r
      INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
      INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
      INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
      INNER JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
      LEFT JOIN tb_turma t ON a.idTurma = t.idTurma
      LEFT JOIN tb_serie s ON t.idSerie = s.idSerie
      LEFT JOIN tb_filial f ON s.idFilial = f.idFilial
      WHERE i.idOlimpiada = ? AND r.idTipoMedalha IS NOT NULL
      ORDER BY 
        CASE tm.tipoMedalha
          WHEN 'Ouro' THEN 1
          WHEN 'Prata' THEN 2
          WHEN 'Bronze' THEN 3
          ELSE 4
        END,
        r.pontuacao DESC
    `;
    
    const [rows] = await pool.query(query, [idOlimpiada]);
    return rows;
  }

  /**
   * Atualiza classificação de um resultado
   * @param {number} id - ID do resultado
   * @param {number} classificacao - Nova classificação
   * @returns {Promise<Object>}
   */
  static async updateClassificacao(id, classificacao) {
    const query = `
      UPDATE tb_olimpiada_resultado 
      SET classificacao = ?
      WHERE idOlimpiadaResultado = ?
    `;
    
    await pool.query(query, [classificacao, id]);
    return this.findById(id);
  }

  /**
   * Calcula e atualiza classificações automaticamente
   * @param {number} idOlimpiada - ID da olimpíada
   * @returns {Promise<Object>}
   */
  static async calcularClassificacoes(idOlimpiada) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Buscar todos os resultados da olimpíada ordenados por pontuação
      const [resultados] = await connection.query(`
        SELECT r.idOlimpiadaResultado, r.pontuacao
        FROM tb_olimpiada_resultado r
        INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
        WHERE i.idOlimpiada = ?
        ORDER BY r.pontuacao DESC
      `, [idOlimpiada]);
      
      // Atualizar classificação
      for (let i = 0; i < resultados.length; i++) {
        await connection.query(
          'UPDATE tb_olimpiada_resultado SET classificacao = ? WHERE idOlimpiadaResultado = ?',
          [i + 1, resultados[i].idOlimpiadaResultado]
        );
      }
      
      await connection.commit();
      
      return {
        success: true,
        message: `Classificações atualizadas para ${resultados.length} resultados`
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Resultado;


