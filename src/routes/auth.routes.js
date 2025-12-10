const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Fazer login no sistema
 * @access  Public
 */
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
], AuthController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo usuário
 * @access  Public (ou pode ser protegido se quiser que apenas admins criem usuários)
 */
router.post('/register', [
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
    .withMessage('Senha deve ter no mínimo 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  body('cpf')
    .optional()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/)
    .withMessage('CPF inválido'),
  body('telefone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Telefone inválido')
], AuthController.register);

/**
 * @route   GET /api/auth/me
 * @desc    Obter dados do usuário autenticado
 * @access  Private
 */
router.get('/me', authMiddleware, AuthController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Fazer logout (registra no log)
 * @access  Private
 */
router.post('/logout', authMiddleware, AuthController.logout);

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verificar se token é válido
 * @access  Public
 */
router.post('/verify-token', AuthController.verifyToken);

module.exports = router;
