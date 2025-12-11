const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const SincronizacaoController = require('../controllers/sincronizacao.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateSincronizacao = [
  body('idFilial').optional().isInt(),
  body('idAnoLetivo').optional().isInt()
];

const validateIncremental = [
  body('dataUltimaSync').optional().isISO8601()
];

// Rotas - Apenas administradores podem sincronizar
router.post('/sincronizar', authenticate, authorize(1), ...validateSincronizacao, SincronizacaoController.sincronizarTodos);
router.post('/sincronizar/incremental', authenticate, authorize(1), ...validateIncremental, SincronizacaoController.sincronizarIncremental);
router.get('/verificar-conexao', authenticate, authorize(1), SincronizacaoController.verificarConexao);

module.exports = router;
