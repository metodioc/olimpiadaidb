const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const TipoPagamentoController = require('../controllers/tipoPagamento.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateTipoPagamento = [
  body('descricao').trim().notEmpty().withMessage('Descrição é obrigatória'),
  body('status').optional().isIn(['ativo', 'inativo']).withMessage('Status deve ser "ativo" ou "inativo"')
];

const validateId = [
  param('id').isInt()
];

// Rotas
router.get('/', authenticate, TipoPagamentoController.list);
router.get('/:id', authenticate, ...validateId, TipoPagamentoController.getById);
router.post('/', authenticate, authorize(1), ...validateCreateTipoPagamento, TipoPagamentoController.create);
router.put('/:id', authenticate, authorize(1), ...validateId, ...validateCreateTipoPagamento, TipoPagamentoController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, TipoPagamentoController.delete);

module.exports = router;
