const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const FilialController = require('../controllers/filial.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateFilial = [
  body('codFilial').isInt().withMessage('Código da filial deve ser um número'),
  body('filial').trim().notEmpty().withMessage('Nome da filial é obrigatório'),
  body('abFilial').trim().notEmpty().withMessage('Abreviação da filial é obrigatória')
];

const validateId = [
  param('id').isInt()
];

// Rotas
router.get('/', authenticate, FilialController.list);
router.get('/:id', authenticate, ...validateId, FilialController.getById);
router.post('/', authenticate, authorize(1), ...validateCreateFilial, FilialController.create);
router.put('/:id', authenticate, authorize(1), ...validateId, ...validateCreateFilial, FilialController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, FilialController.delete);

module.exports = router;
