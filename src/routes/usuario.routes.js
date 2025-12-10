const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const UsuarioController = require('../controllers/usuario.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateUsuario = [
  body('id_perfil')
    .isInt({ min: 1, max: 4 })
    .withMessage('Perfil inválido'),
  body('nome_completo')
    .trim()
    .notEmpty()
    .withMessage('Nome completo é obrigatório')
    .isLength({ min: 3, max: 150 })
    .withMessage('Nome deve ter entre 3 e 150 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('cpf')
    .optional()
    .matches(/^\d{11}$/)
    .withMessage('CPF deve conter 11 dígitos'),
  body('telefone')
    .optional()
    .matches(/^\d{10,11}$/)
    .withMessage('Telefone deve conter 10 ou 11 dígitos')
];

const validateUpdateUsuario = [
  body('id_perfil')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Perfil inválido'),
  body('nome_completo')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nome completo é obrigatório')
    .isLength({ min: 3, max: 150 })
    .withMessage('Nome deve ter entre 3 e 150 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('senha')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('cpf')
    .optional()
    .matches(/^\d{11}$/)
    .withMessage('CPF deve conter 11 dígitos'),
  body('telefone')
    .optional()
    .matches(/^\d{10,11}$/)
    .withMessage('Telefone deve conter 10 ou 11 dígitos'),
  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser verdadeiro ou falso')
];

const validateId = [
  param('id').isInt().withMessage('ID inválido')
];

// Rotas - Todas protegidas e apenas para administradores (perfil 1)
router.get('/', authenticate, authorize(1), UsuarioController.list);
router.get('/:id', authenticate, authorize(1), ...validateId, UsuarioController.getById);
router.post('/', authenticate, authorize(1), ...validateCreateUsuario, UsuarioController.create);
router.put('/:id', authenticate, authorize(1), ...validateId, ...validateUpdateUsuario, UsuarioController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, UsuarioController.delete);
router.patch('/:id/toggle-status', authenticate, authorize(1), ...validateId, UsuarioController.toggleStatus);

module.exports = router;
