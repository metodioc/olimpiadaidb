const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

// Limpar cache do controller para forçar reload
const controllerPath = require.resolve('../controllers/inscricao.controller');
delete require.cache[controllerPath];

const inscricaoController = require('../controllers/inscricao.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateInscricao = [
  body('idOlimpiada').isInt().withMessage('ID da olimpíada deve ser um número inteiro'),
  body('idAluno').isInt().withMessage('ID do aluno deve ser um número inteiro'),
  body('observacoes').optional().isString()
];

const validateBatchInscricao = [
  body('id_olimpiada').isInt(),
  body('alunos_ids').isArray({ min: 1 }),
  body('alunos_ids.*').isInt()
];

const validateEnrollByTurma = [
  body('id_olimpiada').isInt(),
  body('id_turma').isInt()
];

const validateEnrollBySerie = [
  body('idOlimpiada').isInt(),
  body('idSerie').isInt(),
  body('idFilial').isInt()
];

const validateLote = [
  body('idOlimpiada').isInt(),
  body('tipo').isIn(['serie', 'turma']),
  body('idSerie').optional().isInt(),
  body('idFilial').optional().isInt(),
  body('idTurma').optional().isInt()
];

const validateDeleteLote = [
  body('ids').isArray({ min: 1 }),
  body('ids.*').isInt()
];

const validateUpdateStatus = [
  param('id').isInt(),
  body('status_inscricao').isIn(['pendente', 'confirmada', 'cancelada'])
];

const validateId = [
  param('id').isInt()
];

const validateOlimpiadaId = [
  param('id_olimpiada').isInt()
];

// Rotas - rotas específicas primeiro, depois parametrizadas
// Níveis: 1=Administrador, 2=Professor, 3=Aluno, 4=Responsável
router.get('/olimpiada/:id_olimpiada/estatisticas', authenticate, authorize(1, 2), ...validateOlimpiadaId, inscricaoController.getStatsByOlimpiada);
router.get('/', authenticate, inscricaoController.list);
router.get('/:id', authenticate, ...validateId, inscricaoController.getById);
router.post('/', authenticate, authorize(1, 2), ...validateCreateInscricao, inscricaoController.create);
router.post('/lote', authenticate, authorize(1, 2), ...validateLote, inscricaoController.createLote);
router.delete('/lote', authenticate, authorize(1, 2), ...validateDeleteLote, inscricaoController.deleteLote);
router.patch('/:id/status', authenticate, authorize(1, 2), ...validateUpdateStatus, inscricaoController.updateStatus);
router.delete('/:id', authenticate, authorize(1, 2), ...validateId, inscricaoController.cancel);

module.exports = router;
