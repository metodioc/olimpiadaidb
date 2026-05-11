const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const TipoOlimpiadaController = require('../controllers/tipoOlimpiada.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

const validateCreate = [
  body('nomeOlimpiada').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 200 }),
  body('abreviacao').trim().notEmpty().withMessage('Abreviação é obrigatória').isLength({ max: 20 }),
  body('descricao').optional().isString(),
  body('ativo').optional().isBoolean()
];

const validateUpdate = [
  body('nomeOlimpiada').optional().trim().isLength({ max: 200 }),
  body('abreviacao').optional().trim().isLength({ max: 20 }),
  body('descricao').optional().isString(),
  body('ativo').optional().isBoolean()
];

router.get('/',    authMiddleware, TipoOlimpiadaController.list);
router.get('/:id', authMiddleware, TipoOlimpiadaController.getById);
router.post('/',   authMiddleware, checkRole(1), validateCreate, TipoOlimpiadaController.create);
router.put('/:id', authMiddleware, checkRole(1), validateUpdate, TipoOlimpiadaController.update);

module.exports = router;
