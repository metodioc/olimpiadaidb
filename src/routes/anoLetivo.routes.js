const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const AnoLetivoController = require('../controllers/anoLetivo.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateAnoLetivo = [
  body('anoLetivo').isInt({ min: 2000, max: 2100 }).withMessage('Ano letivo deve ser entre 2000 e 2100'),
  body('status').optional().isIn(['ativo', 'inativo']).withMessage('Status deve ser "ativo" ou "inativo"')
];

const validateId = [
  param('id').isInt()
];

// Rotas
router.get('/', authenticate, AnoLetivoController.list);
router.get('/:id', authenticate, ...validateId, AnoLetivoController.getById);
router.post('/', authenticate, authorize(1), ...validateCreateAnoLetivo, AnoLetivoController.create);
router.put('/:id', authenticate, authorize(1), ...validateId, ...validateCreateAnoLetivo, AnoLetivoController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, AnoLetivoController.delete);

module.exports = router;
