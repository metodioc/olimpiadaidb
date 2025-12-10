const UsuarioModel = require('../models/Usuario.model');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

/**
 * Controller para gerenciar usuários
 */
class UsuarioController {

  /**
   * Listar todos os usuários
   */
  static async list(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll(req.query);

      res.status(200).json({
        success: true,
        count: usuarios.length,
        data: usuarios
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar usuários',
        error: error.message
      });
    }
  }

  /**
   * Buscar usuário por ID
   */
  static async getById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const usuario = await UsuarioModel.findById(req.params.id);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: usuario
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário',
        error: error.message
      });
    }
  }
  
  /**
   * Criar novo usuário
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      // Verificar se email já existe
      const existingUser = await UsuarioModel.findByEmail(req.body.email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(req.body.senha, 10);
      
      const userId = await UsuarioModel.create({
        ...req.body,
        senha: hashedPassword
      });
      
      const usuario = await UsuarioModel.findById(userId);
      
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: usuario
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar usuário',
        error: error.message
      });
    }
  }
  
  /**
   * Atualizar usuário
   */
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Se está alterando email, verificar se já existe
      if (req.body.email && req.body.email !== usuario.email) {
        const existingUser = await UsuarioModel.findByEmail(req.body.email);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Email já cadastrado'
          });
        }
      }

      // Se está alterando senha, fazer hash
      let updateData = { ...req.body };
      if (req.body.senha) {
        updateData.senha = await bcrypt.hash(req.body.senha, 10);
      }

      await UsuarioModel.update(req.params.id, updateData);
      const updatedUser = await UsuarioModel.findById(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: updatedUser
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário',
        error: error.message
      });
    }
  }
  
  /**
   * Deletar usuário (desativar)
   */
  static async delete(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Não permitir que o usuário delete a si mesmo
      if (req.user.id_usuario === parseInt(req.params.id)) {
        return res.status(403).json({
          success: false,
          message: 'Você não pode desativar sua própria conta'
        });
      }

      await UsuarioModel.deactivate(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Usuário desativado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar usuário',
        error: error.message
      });
    }
  }

  /**
   * Alternar status ativo/inativo
   */
  static async toggleStatus(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Não permitir que o usuário desative a si mesmo
      if (req.user.id_usuario === parseInt(req.params.id)) {
        return res.status(403).json({
          success: false,
          message: 'Você não pode alterar o status da sua própria conta'
        });
      }

      await UsuarioModel.toggleStatus(req.params.id);
      const updatedUser = await UsuarioModel.findById(req.params.id);
      
      res.status(200).json({
        success: true,
        message: `Usuário ${updatedUser.ativo ? 'ativado' : 'desativado'} com sucesso`,
        data: updatedUser
      });
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao alterar status do usuário',
        error: error.message
      });
    }
  }
}

module.exports = UsuarioController;
