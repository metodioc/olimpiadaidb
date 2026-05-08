const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const SincronizacaoPessoaController = require('../controllers/sincronizacaoPessoa.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

/**
 * @route POST /api/sincronizacao/pessoas
 * @desc Sincronizar todas as pessoas com TOTVS
 * @access Admin only
 */
router.post(
  '/pessoas',
  authenticate,
  authorize(1),
  [
    body('idAnoLetivo')
      .optional()
      .isInt({ min: 1 })
      .withMessage('idAnoLetivo deve ser um número inteiro positivo')
  ],
  SincronizacaoPessoaController.sincronizarTodos
);

/**
 * @route GET /api/sincronizacao/pessoas/verificar-conexao
 * @desc Verificar status da conexão com TOTVS (pessoas)
 * @access Admin only
 */
router.get(
  '/pessoas/verificar-conexao',
  authenticate,
  authorize(1),
  SincronizacaoPessoaController.verificarConexao
);

module.exports = router;
