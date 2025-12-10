const { validationResult } = require('express-validator');
const Resultado = require('../models/Resultado.model');

/**
 * Lista resultados com filtros
 */
exports.list = async (req, res) => {
  try {
    const { idOlimpiada, idAluno, idTipoMedalha } = req.query;
    
    const filters = {};
    if (idOlimpiada) filters.idOlimpiada = idOlimpiada;
    if (idAluno) filters.idAluno = idAluno;
    if (idTipoMedalha) filters.idTipoMedalha = idTipoMedalha;
    
    const resultados = await Resultado.findAll(filters);
    
    res.json({
      success: true,
      data: resultados,
      count: resultados.length
    });
  } catch (error) {
    console.error('Erro ao listar resultados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar resultados',
      error: error.message
    });
  }
};

/**
 * Busca resultado por ID
 */
exports.getById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const resultado = await Resultado.findById(id);
    
    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: 'Resultado não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao buscar resultado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar resultado',
      error: error.message
    });
  }
};

/**
 * Cria novo resultado
 */
exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const resultado = await Resultado.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Resultado lançado com sucesso',
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao criar resultado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao lançar resultado',
      error: error.message
    });
  }
};

/**
 * Lança resultados em lote
 */
exports.createBatch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { resultados } = req.body;
    
    if (!Array.isArray(resultados) || resultados.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'O campo resultados deve ser um array não vazio'
      });
    }
    
    const result = await Resultado.createBatch(resultados);
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao lançar resultados em lote:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao lançar resultados em lote',
      error: error.message
    });
  }
};

/**
 * Atualiza resultado
 */
exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const resultado = await Resultado.update(id, req.body);
    
    res.json({
      success: true,
      message: 'Resultado atualizado com sucesso',
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao atualizar resultado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar resultado',
      error: error.message
    });
  }
};

/**
 * Remove resultado
 */
exports.delete = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    await Resultado.delete(id);
    
    res.json({
      success: true,
      message: 'Resultado removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover resultado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover resultado',
      error: error.message
    });
  }
};

/**
 * Ranking geral de uma olimpíada
 */
exports.getRankingGeral = async (req, res) => {
  try {
    const { idOlimpiada } = req.params;
    const ranking = await Resultado.getRankingGeral(idOlimpiada);
    
    res.json({
      success: true,
      data: ranking,
      count: ranking.length
    });
  } catch (error) {
    console.error('Erro ao buscar ranking geral:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ranking geral',
      error: error.message
    });
  }
};

/**
 * Ranking por série
 */
exports.getRankingPorSerie = async (req, res) => {
  try {
    const { idOlimpiada, idSerie } = req.params;
    const ranking = await Resultado.getRankingPorSerie(idOlimpiada, idSerie);
    
    res.json({
      success: true,
      data: ranking,
      count: ranking.length
    });
  } catch (error) {
    console.error('Erro ao buscar ranking por série:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ranking por série',
      error: error.message
    });
  }
};

/**
 * Lista medalhistas
 */
exports.getMedalhistas = async (req, res) => {
  try {
    const { idOlimpiada } = req.params;
    const medalhistas = await Resultado.getMedalhistas(idOlimpiada);
    
    res.json({
      success: true,
      data: medalhistas,
      count: medalhistas.length
    });
  } catch (error) {
    console.error('Erro ao buscar medalhistas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar medalhistas',
      error: error.message
    });
  }
};

/**
 * Calcula classificações
 */
exports.calcularClassificacoes = async (req, res) => {
  try {
    const { idOlimpiada } = req.params;
    const result = await Resultado.calcularClassificacoes(idOlimpiada);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao calcular classificações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao calcular classificações',
      error: error.message
    });
  }
};
