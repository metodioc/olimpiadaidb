const { validationResult } = require('express-validator');
const InscricaoModel = require('../models/Inscricao.model');

// Controller de Inscricoes - v2.0 - ${Date.now()}

/**
 * Lista inscrições com filtros
 */
exports.list = async (req, res) => {
  try {
    const { idOlimpiada, idAluno, statusInscricao } = req.query;
    
    const inscricoes = await InscricaoModel.findAll({
      idOlimpiada,
      idAluno,
      statusInscricao
    });
    
    return res.status(200).json({
      success: true,
      data: inscricoes,
      count: inscricoes.length
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar inscrições',
      details: error.message
    });
  }
};

/**
 * Busca inscrição por ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inscricao = await InscricaoModel.findById(id);
    
    if (!inscricao) {
      return res.status(404).json({
        error: 'Inscrição não encontrada'
      });
    }
      
    return res.status(200).json({ inscricao });
      
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao buscar inscrição',
      details: error.message
    });
  }
};

/**
 * Cria inscrição individual
 */
exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    
    const inscricaoId = await InscricaoModel.create(req.body);
    const inscricao = await InscricaoModel.findById(inscricaoId);
    
    return res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso',
      data: inscricao
    });
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao criar inscrição'
    });
  }
};

/**
 * Cria inscrições em lote
 */
exports.createBatch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    
    const { id_olimpiada, alunos_ids } = req.body;
    const result = await InscricaoModel.createBatch(id_olimpiada, alunos_ids);
    
    return res.status(201).json({
      message: `${result.inseridos} inscrição(ões) realizada(s)`,
      ...result
    });
    
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erro ao criar inscrições em lote'
    });
  }
};

/**
 * Inscreve todos os alunos de uma turma
 */
exports.enrollByTurma = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    
    const { id_olimpiada, id_turma } = req.body;
    const result = await InscricaoModel.enrollByTurma(id_olimpiada, id_turma);
    
    return res.status(201).json({
      message: `${result.inseridos} aluno(s) inscrito(s) da turma`,
      ...result
    });
    
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erro ao inscrever turma'
    });
  }
};

/**
 * Inscreve todos os alunos de uma série
 */
exports.enrollBySerie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    
    const { idOlimpiada, idSerie, idFilial } = req.body;
    const result = await InscricaoModel.enrollBySerie(idOlimpiada, idSerie, idFilial);
    
    return res.status(201).json({
      success: true,
      message: `${result.inscricoes.length} aluno(s) inscrito(s) da série`,
      inscritos: result.inscricoes.length,
      erros: result.erros
    });
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao inscrever série'
    });
  }
};

/**
 * Cria inscrições em lote (tipo: serie, turma ou lista de IDs)
 */
exports.createLote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    
    const { idOlimpiada, tipo, idSerie, idFilial, idTurma } = req.body;
    let result;
    
    if (tipo === 'serie') {
      result = await InscricaoModel.enrollBySerie(idOlimpiada, idSerie, idFilial);
    } else if (tipo === 'turma') {
      result = await InscricaoModel.enrollByTurma(idOlimpiada, idTurma);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Tipo de inscrição inválido'
      });
    }
    
    return res.status(201).json({
      success: true,
      message: `${result.inscricoes.length} aluno(s) inscrito(s) com sucesso`,
      inscritos: result.inscricoes.length,
      jaInscritos: result.erros.filter(e => e.erro === 'Já inscrito').length
    });
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao criar inscrições'
    });
  }
};

/**
 * Remove múltiplas inscrições
 */
exports.deleteLote = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'IDs inválidos'
      });
    }
    
    const deleted = await InscricaoModel.deleteBatch(ids);
    
    return res.status(200).json({
      success: true,
      message: `${deleted} inscrição(ões) removida(s)`,
      deleted
    });
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao remover inscrições'
    });
  }
};

/**
 * Atualiza status da inscrição
 */
exports.updateStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    
    const { id } = req.params;
    const { status_inscricao } = req.body;
    
    await InscricaoModel.updateStatus(id, status_inscricao);
    const inscricao = await InscricaoModel.findById(id);
    
    return res.status(200).json({
      message: 'Status atualizado com sucesso',
      inscricao
    });
    
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erro ao atualizar status'
    });
  }
};

/**
 * Cancela inscrição
 */
exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    await InscricaoModel.updateStatus(id, 'cancelada');
    
    return res.status(200).json({
      message: 'Inscrição cancelada com sucesso'
    });
    
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Erro ao cancelar inscrição'
    });
  }
};

/**
 * Obtém estatísticas de inscrições de uma olimpíada
 */
exports.getStatsByOlimpiada = async (req, res) => {
  try {
    const { id_olimpiada } = req.params;
    const stats = await InscricaoModel.countByOlimpiada(id_olimpiada);
    
    return res.status(200).json({
      id_olimpiada: parseInt(id_olimpiada),
      ...stats
    });
    
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao obter estatísticas',
      details: error.message
    });
  }
};
