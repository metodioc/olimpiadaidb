const express = require('express');
const router = express.Router();
const SincronizacaoTurmaController = require('../controllers/sincronizacaoTurma.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

/**
 * @route POST /api/sincronizacao/turmas
 * @description Sincronizar turmas do TOTVS
 * @access Privado (Admin)
 */
router.post('/', 
  authenticate,
  authorize(1),
  SincronizacaoTurmaController.sincronizarTodos
);

/**
 * @route GET /api/sincronizacao/turmas/verificar
 * @description Verificar conexão com TOTVS
 * @access Privado (Admin)
 */
router.get('/verificar',
  authenticate,
  authorize(1),
  SincronizacaoTurmaController.verificarConexao
);

module.exports = router;
