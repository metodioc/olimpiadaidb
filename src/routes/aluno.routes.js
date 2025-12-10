const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const AlunoController = require('../controllers/aluno.controller');
const { authMiddleware: authenticate, checkRole: authorize } = require('../middleware/auth.middleware');

// Validações
const validateCreateAluno = [
  body('ra').trim().notEmpty().withMessage('RA é obrigatório'),
  body('situacao').optional().isIn(['ativo', 'inativo', 'transferido', 'concluído']),
  body('tipo').optional().isIn(['regular', 'bolsista', 'especial']),
  body('sistema').optional().trim(),
  body('idGrupoEscola').optional().isInt(),
  body('idPessoa').isInt().withMessage('ID da pessoa deve ser um número'),
  body('idTurma').isInt().withMessage('ID da turma deve ser um número')
];

const validateId = [
  param('id').isInt()
];

// Rotas
router.get('/', authenticate, AlunoController.list);
router.get('/:id', authenticate, ...validateId, AlunoController.getById);
router.post('/', authenticate, authorize(1, 2), ...validateCreateAluno, AlunoController.create);
router.put('/:id', authenticate, authorize(1, 2), ...validateId, ...validateCreateAluno, AlunoController.update);
router.delete('/:id', authenticate, authorize(1), ...validateId, AlunoController.delete);

module.exports = router;
