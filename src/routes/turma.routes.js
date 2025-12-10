const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const TurmaController = require('../controllers/turma.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateTurma = [
  body('codTurma').trim().notEmpty().withMessage('Código da turma é obrigatório'),
  body('turma').trim().notEmpty().withMessage('Nome da turma é obrigatório'),
  body('idSerie').isInt().withMessage('ID da série deve ser um número'),
  body('idAnoLetivo').isInt().withMessage('ID do ano letivo deve ser um número'),
  body('turno').optional().isIn(['matutino', 'vespertino', 'noturno', 'integral'])
];

const validateId = [
  param('id').isInt()
];

// Rotas
router.get('/', authenticate, TurmaController.list);
router.get('/:id', authenticate, ...validateId, TurmaController.getById);
router.post('/', authenticate, authorize(1, 2), ...validateCreateTurma, TurmaController.create);
router.put('/:id', authenticate, authorize(1, 2), ...validateId, ...validateCreateTurma, TurmaController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, TurmaController.delete);

module.exports = router;
