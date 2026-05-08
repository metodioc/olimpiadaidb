const express = require('express');
const router = express.Router();
const SincronizacaoFilialController = require('../controllers/sincronizacaoFilial.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

/**
 * @route POST /api/sincronizacao/filiais
 * @desc Sincronizar todas as filiais com TOTVS
 * @access Admin only
 */
router.post(
  '/filiais',
  authenticate,
  authorize(1),
  SincronizacaoFilialController.sincronizarTodos
);

/**
 * @route GET /api/sincronizacao/filiais/verificar-conexao
 * @desc Verificar status da conexão com TOTVS (filiais)
 * @access Admin only
 */
router.get(
  '/filiais/verificar-conexao',
  authenticate,
  authorize(1),
  SincronizacaoFilialController.verificarConexao
);

module.exports = router;
