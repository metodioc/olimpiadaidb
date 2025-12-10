const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const LocalAplicacaoController = require('../controllers/localAplicacao.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateLocalAplicacao = [
  body('nomeLocal').trim().notEmpty().withMessage('Nome do local é obrigatório'),
  body('status').optional().isIn(['ativo', 'inativo']).withMessage('Status deve ser "ativo" ou "inativo"')
];

const validateId = [
  param('id').isInt()
];

// Rotas
router.get('/', authenticate, LocalAplicacaoController.list);
router.get('/:id', authenticate, ...validateId, LocalAplicacaoController.getById);
router.post('/', authenticate, authorize(1), ...validateCreateLocalAplicacao, LocalAplicacaoController.create);
router.put('/:id', authenticate, authorize(1), ...validateId, ...validateCreateLocalAplicacao, LocalAplicacaoController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, LocalAplicacaoController.delete);

module.exports = router;
