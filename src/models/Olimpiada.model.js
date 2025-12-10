const { pool } = require('../config/database');

/**
 * Model para gerenciar Olimpíadas
 */
class OlimpiadaModel {
  
  /**
   * Listar todas as olimpíadas
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        o.*,
        u.nome_completo as responsavel_nome,
        l.nomeLocal as localAplicacao,
        tp.descricao as tipoPagamento,
        tc.descricao as tipoCorrecao
      FROM tb_olimpiada o
      INNER JOIN tb_usuario u ON o.idUsuarioResponsavel = u.id_usuario
      LEFT JOIN tb_local_aplicacao l ON o.idLocalAplicacao = l.idLocalAplicacao
      LEFT JOIN tb_tipo_pagamento tp ON o.idTipoPagamento = tp.idTipoPagamento
      LEFT JOIN tb_tipo_correcao tc ON o.idTipoCorrecao = tc.idTipoCorrecao
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.ano) {
      query += ' AND o.ano = ?';
      params.push(filters.ano);
    }
    
    if (filters.status) {
      query += ' AND o.status = ?';
      params.push(filters.status);
    }
    
    query += ' ORDER BY o.ano DESC, o.dataAplicacao DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }
  
  /**
   * Buscar olimpíada por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        o.*,
        u.nome_completo as responsavel_nome,
        u.email as responsavel_email,
        l.nomeLocal as localAplicacao,
        tp.descricao as tipoPagamento,
        tc.descricao as tipoCorrecao
      FROM tb_olimpiada o
      INNER JOIN tb_usuario u ON o.idUsuarioResponsavel = u.id_usuario
      LEFT JOIN tb_local_aplicacao l ON o.idLocalAplicacao = l.idLocalAplicacao
      LEFT JOIN tb_tipo_pagamento tp ON o.idTipoPagamento = tp.idTipoPagamento
      LEFT JOIN tb_tipo_correcao tc ON o.idTipoCorrecao = tc.idTipoCorrecao
      WHERE o.idOlimpiada = ?`,
      [id]
    );
    return rows[0];
  }
  
  /**
   * Buscar disciplinas de uma olimpíada
   */
  static async getDisciplinas(olimpiadaId) {
    const [rows] = await pool.query(
      `SELECT 
        d.idDisciplina,
        d.nomeDisciplina,
        d.abreviacaoDisciplina,
        od.principal,
        a.nomeArea
      FROM tb_olimpiada_disciplina od
      INNER JOIN tb_disciplina d ON od.idDisciplina = d.idDisciplina
      INNER JOIN tb_area_conhecimento a ON d.idAreaConhecimento = a.idAreaConhecimento
      WHERE od.idOlimpiada = ?
      ORDER BY od.principal DESC, d.nomeDisciplina`,
      [olimpiadaId]
    );
    return rows;
  }
  
  /**
   * Buscar filiais vinculadas a uma olimpíada
   */
  static async getFiliais(olimpiadaId) {
    const [rows] = await pool.query(
      `SELECT 
        f.idFilial,
        f.filial,
        f.abFilial
      FROM tb_olimpiada_filial of
      INNER JOIN tb_filial f ON of.idFilial = f.idFilial
      WHERE of.idOlimpiada = ?
      ORDER BY f.filial`,
      [olimpiadaId]
    );
    return rows;
  }
  
  /**
   * Criar nova olimpíada
   */
  static async create(olimpiadaData) {
    const {
      nomeOlimpiada,
      abreviacaoOlimpiada,
      ano,
      idUsuarioResponsavel,
      idLocalAplicacao,
      idTipoPagamento,
      idTipoCorrecao,
      valorCusto,
      dataLimiteInscricao,
      dataAplicacao,
      dataCorrecao,
      observacoes
    } = olimpiadaData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_olimpiada 
        (nomeOlimpiada, abreviacaoOlimpiada, ano, idUsuarioResponsavel,
         idLocalAplicacao, idTipoPagamento, idTipoCorrecao, valorCusto,
         dataLimiteInscricao, dataAplicacao, dataCorrecao, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomeOlimpiada, abreviacaoOlimpiada, ano, idUsuarioResponsavel,
        idLocalAplicacao, idTipoPagamento, idTipoCorrecao, valorCusto,
        dataLimiteInscricao, dataAplicacao, dataCorrecao, observacoes
      ]
    );
    
    return result.insertId;
  }
  
  /**
   * Atualizar olimpíada
   */
  static async update(olimpiadaId, olimpiadaData) {
    const {
      nomeOlimpiada,
      abreviacaoOlimpiada,
      ano,
      idUsuarioResponsavel,
      idLocalAplicacao,
      idTipoPagamento,
      idTipoCorrecao,
      valorCusto,
      dataLimiteInscricao,
      dataAplicacao,
      dataCorrecao,
      observacoes
    } = olimpiadaData;
    
    const [result] = await pool.query(
      `UPDATE tb_olimpiada SET
        nomeOlimpiada = COALESCE(?, nomeOlimpiada),
        abreviacaoOlimpiada = COALESCE(?, abreviacaoOlimpiada),
        ano = COALESCE(?, ano),
        idUsuarioResponsavel = COALESCE(?, idUsuarioResponsavel),
        idLocalAplicacao = ?,
        idTipoPagamento = ?,
        idTipoCorrecao = ?,
        valorCusto = ?,
        dataLimiteInscricao = ?,
        dataAplicacao = ?,
        dataCorrecao = ?,
        observacoes = ?
      WHERE idOlimpiada = ?`,
      [
        nomeOlimpiada, abreviacaoOlimpiada, ano, idUsuarioResponsavel,
        idLocalAplicacao, idTipoPagamento, idTipoCorrecao, valorCusto,
        dataLimiteInscricao, dataAplicacao, dataCorrecao, observacoes,
        olimpiadaId
      ]
    );
    
    return result.affectedRows;
  }
  
  /**
   * Vincular disciplinas à olimpíada
   */
  static async addDisciplinas(olimpiadaId, disciplinas) {
    const values = disciplinas.map(d => [olimpiadaId, d.idDisciplina, d.principal || false]);
    
    await pool.query(
      `INSERT INTO tb_olimpiada_disciplina 
        (idOlimpiada, idDisciplina, principal) 
      VALUES ?`,
      [values]
    );
  }
  
  /**
   * Vincular filiais à olimpíada
   */
  static async addFiliais(olimpiadaId, filiaisIds) {
    const values = filiaisIds.map(id => [olimpiadaId, id]);
    
    await pool.query(
      `INSERT INTO tb_olimpiada_filial 
        (idOlimpiada, idFilial) 
      VALUES ?`,
      [values]
    );
  }
  
  /**
   * Atualizar status da olimpíada
   */
  static async updateStatus(olimpiadaId, novoStatus) {
    await pool.query(
      'UPDATE tb_olimpiada SET status = ? WHERE idOlimpiada = ?',
      [novoStatus, olimpiadaId]
    );
  }
}

module.exports = OlimpiadaModel;
