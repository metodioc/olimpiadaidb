const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

// Limpar cache do controller para forçar reload
const controllerPath = require.resolve('../controllers/resultado.controller');
delete require.cache[controllerPath];

const resultadoController = require('../controllers/resultado.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateResultado = [
  body('idOlimpiadaInscricao').isInt(),
  body('pontuacao').isFloat({ min: 0 }),
  body('idTipoMedalha').optional().isInt(),
  body('observacoes').optional().isString()
];

const validateBatchResultados = [
  body('resultados').isArray({ min: 1 }),
  body('resultados.*.idOlimpiadaInscricao').isInt(),
  body('resultados.*.pontuacao').isFloat({ min: 0 }),
  body('resultados.*.idTipoMedalha').optional().isInt()
];

const validateUpdate = [
  param('id').isInt(),
  body('pontuacao').optional().isFloat({ min: 0 }),
  body('idTipoMedalha').optional().isInt(),
  body('observacoes').optional().isString()
];

const validateId = [
  param('id').isInt()
];

const validateOlimpiadaId = [
  param('idOlimpiada').isInt()
];

const validateSerieRanking = [
  param('idOlimpiada').isInt(),
  param('idSerie').isInt()
];

// Rotas - rotas específicas primeiro, depois parametrizadas
// Níveis: 1=Administrador, 2=Professor, 3=Aluno, 4=Responsável
router.post('/calcular-classificacoes/:idOlimpiada', authenticate, authorize(1, 2), ...validateOlimpiadaId, resultadoController.calcularClassificacoes);
router.get('/ranking/:idOlimpiada', authenticate, ...validateOlimpiadaId, resultadoController.getRankingGeral);
router.get('/ranking/:idOlimpiada/serie/:idSerie', authenticate, ...validateSerieRanking, resultadoController.getRankingPorSerie);
router.get('/medalhistas/:idOlimpiada', authenticate, ...validateOlimpiadaId, resultadoController.getMedalhistas);
router.get('/', authenticate, resultadoController.list);
router.get('/:id', authenticate, ...validateId, resultadoController.getById);
router.post('/', authenticate, authorize(1, 2), ...validateCreateResultado, resultadoController.create);
router.post('/lote', authenticate, authorize(1, 2), ...validateBatchResultados, resultadoController.createBatch);
router.put('/:id', authenticate, authorize(1, 2), ...validateUpdate, resultadoController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, resultadoController.delete);

module.exports = router;
