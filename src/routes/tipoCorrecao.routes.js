const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const tipoCorrecaoController = require('../controllers/tipoCorrecao.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateTipoCorrecao = [
  check('descricao')
    .trim()
    .notEmpty().withMessage('Descrição é obrigatória')
    .isLength({ max: 50 }).withMessage('Descrição deve ter no máximo 50 caracteres'),
  check('ativo')
    .optional()
    .isIn(['S', 'N']).withMessage('Status deve ser S ou N'),
  check('observacao')
    .optional()
    .trim()
];

// Rotas públicas (requerem autenticação)
router.get('/', authenticate, tipoCorrecaoController.list);
router.get('/:id', authenticate, tipoCorrecaoController.getById);

// Rotas protegidas (requerem admin)
router.post('/', authenticate, authorize(1), validateTipoCorrecao, tipoCorrecaoController.create);
router.put('/:id', authenticate, authorize(1), validateTipoCorrecao, tipoCorrecaoController.update);
router.delete('/:id', authenticate, authorize(1), tipoCorrecaoController.delete);
router.patch('/:id/toggle-status', authenticate, authorize(1), tipoCorrecaoController.toggleStatus);

module.exports = router;
