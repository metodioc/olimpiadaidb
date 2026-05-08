const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const SincronizacaoSerieController = require('../controllers/sincronizacaoSerie.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

/**
 * @route POST /api/sincronizacao/series
 * @desc Sincronizar todas as séries com TOTVS
 * @access Admin only
 */
router.post(
  '/series',
  authenticate,
  authorize(1),
  [
    body('idAnoLetivo')
      .optional()
      .isInt({ min: 1 })
      .withMessage('idAnoLetivo deve ser um número inteiro positivo')
  ],
  SincronizacaoSerieController.sincronizarTodos
);

/**
 * @route GET /api/sincronizacao/series/verificar-conexao
 * @desc Verificar status da conexão com TOTVS (séries)
 * @access Admin only
 */
router.get(
  '/series/verificar-conexao',
  authenticate,
  authorize(1),
  SincronizacaoSerieController.verificarConexao
);

module.exports = router;
