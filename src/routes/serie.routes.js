const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const SerieController = require('../controllers/serie.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateSerie = [
  body('codSerie').isInt().withMessage('Código da série deve ser um número'),
  body('abSerie').trim().notEmpty().withMessage('Abreviação da série é obrigatória'),
  body('serie').trim().notEmpty().withMessage('Nome da série é obrigatório'),
  body('idFilial').isInt().withMessage('ID da filial é obrigatório')
];

const validateId = [
  param('id').isInt()
];

// Rotas
router.get('/', authenticate, SerieController.list);
router.get('/:id', authenticate, ...validateId, SerieController.getById);
router.post('/', authenticate, authorize(1), ...validateCreateSerie, SerieController.create);
router.put('/:id', authenticate, authorize(1), ...validateId, ...validateCreateSerie, SerieController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, SerieController.delete);

module.exports = router;
