const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const SincronizacaoAnoLetivoController = require('../controllers/sincronizacaoAnoLetivo.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

/**
 * @route POST /api/sincronizacao/anos-letivos
 * @desc Sincronizar anos letivos com TOTVS (endpoint OLIMPIADAS006)
 * @access Admin only
 */
router.post(
  '/anos-letivos',
  authenticate,
  authorize(1),
  [
    body('idAnoLetivo')
      .optional()
      .isInt({ min: 2000 })
      .withMessage('idAnoLetivo deve ser um número inteiro válido (mín. 2000)')
  ],
  SincronizacaoAnoLetivoController.sincronizarTodos
);

/**
 * @route GET /api/sincronizacao/anos-letivos/verificar-conexao
 * @desc Verificar status da conexão com TOTVS (anos letivos)
 * @access Admin only
 */
router.get(
  '/anos-letivos/verificar-conexao',
  authenticate,
  authorize(1),
  SincronizacaoAnoLetivoController.verificarConexao
);

module.exports = router;
