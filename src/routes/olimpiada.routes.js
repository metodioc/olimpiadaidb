const express = require('express');
const { body } = require('express-validator');
const OlimpiadaController = require('../controllers/olimpiada.controller');
const { authMiddleware, checkRole, checkPermission } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/olimpiadas
 * @desc    Listar todas as olimpíadas (com filtros opcionais)
 * @access  Private
 * @query   ?ano=2025&status=inscricoes_abertas
 */
router.get('/', 
  authMiddleware,
  OlimpiadaController.list
);

/**
 * @route   GET /api/olimpiadas/:id
 * @desc    Obter detalhes de uma olimpíada
 * @access  Private
 */
router.get('/:id', 
  authMiddleware,
  OlimpiadaController.getById
);

/**
 * @route   POST /api/olimpiadas
 * @desc    Criar nova olimpíada
 * @access  Private - Apenas Admin e Professor
 */
router.post('/',
  authMiddleware,
  checkRole(1, 2), // Admin ou Professor
  [
    body('nomeOlimpiada')
      .trim()
      .notEmpty()
      .withMessage('Nome da olimpíada é obrigatório')
      .isLength({ min: 3, max: 200 })
      .withMessage('Nome deve ter entre 3 e 200 caracteres'),
    body('abreviacaoOlimpiada')
      .trim()
      .notEmpty()
      .withMessage('Abreviação é obrigatória')
      .isLength({ max: 20 })
      .withMessage('Abreviação deve ter no máximo 20 caracteres'),
    body('ano')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Ano inválido'),
    body('idUsuarioResponsavel')
      .optional()
      .isInt()
      .withMessage('ID do usuário responsável inválido'),
    body('idLocalAplicacao')
      .optional()
      .isInt()
      .withMessage('ID do local de aplicação inválido'),
    body('idTipoPagamento')
      .optional()
      .isInt()
      .withMessage('ID do tipo de pagamento inválido'),
    body('idTipoCorrecao')
      .optional({ nullable: true, checkFalsy: true })
      .isInt()
      .withMessage('ID do tipo de correção inválido'),
    body('dataLimiteInscricao')
      .optional()
      .isISO8601()
      .withMessage('Data limite de inscrição inválida'),
    body('dataAplicacao')
      .optional()
      .isISO8601()
      .withMessage('Data de aplicação inválida'),
    body('dataCorrecao')
      .optional()
      .isISO8601()
      .withMessage('Data de correção inválida'),
    body('disciplinas')
      .optional()
      .isArray()
      .withMessage('Disciplinas deve ser um array'),
    body('filiais')
      .optional()
      .isArray()
      .withMessage('Filiais deve ser um array')
  ],
  OlimpiadaController.create
);

/**
 * @route   PUT /api/olimpiadas/:id
 * @desc    Atualizar olimpíada
 * @access  Private - Apenas Admin e Professor
 */
router.put('/:id',
  authMiddleware,
  checkRole(1, 2),
  [
    body('nomeOlimpiada')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Nome deve ter entre 3 e 200 caracteres'),
    body('abreviacaoOlimpiada')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Abreviação deve ter no máximo 20 caracteres'),
    body('ano')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Ano inválido'),
    body('idUsuarioResponsavel')
      .optional()
      .isInt()
      .withMessage('ID do usuário responsável inválido'),
    body('idLocalAplicacao')
      .optional({ nullable: true, checkFalsy: true })
      .isInt()
      .withMessage('ID do local de aplicação inválido'),
    body('idTipoPagamento')
      .optional({ nullable: true, checkFalsy: true })
      .isInt()
      .withMessage('ID do tipo de pagamento inválido'),
    body('idTipoCorrecao')
      .optional({ nullable: true, checkFalsy: true })
      .isInt()
      .withMessage('ID do tipo de correção inválido'),
    body('dataLimiteInscricao')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage('Data limite de inscrição inválida'),
    body('dataAplicacao')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage('Data de aplicação inválida'),
    body('dataCorrecao')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage('Data de correção inválida')
  ],
  OlimpiadaController.update
);

/**
 * @route   PUT /api/olimpiadas/:id/status
 * @desc    Atualizar status da olimpíada
 * @access  Private - Apenas Admin e Professor
 */
router.put('/:id/status',
  authMiddleware,
  checkRole(1, 2),
  [
    body('status')
      .isIn([
        'planejamento',
        'inscricoes_abertas',
        'inscricoes_encerradas',
        'realizada',
        'corrigida',
        'finalizada',
        'cancelada'
      ])
      .withMessage('Status inválido')
  ],
  OlimpiadaController.updateStatus
);

/**
 * @route   GET /api/olimpiadas/:id/disciplinas
 * @desc    Listar disciplinas de uma olimpíada
 * @access  Private
 */
router.get('/:id/disciplinas',
  authMiddleware,
  OlimpiadaController.getDisciplinas
);

/**
 * @route   GET /api/olimpiadas/:id/filiais
 * @desc    Listar filiais participantes de uma olimpíada
 * @access  Private
 */
router.get('/:id/filiais',
  authMiddleware,
  OlimpiadaController.getFiliais
);

module.exports = router;
