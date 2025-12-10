const { validationResult } = require('express-validator');
const AuthService = require('../services/auth.service');

/**
 * Controller de Autenticação
 * Gerencia requisições HTTP relacionadas à autenticação
 */
class AuthController {
  
  /**
   * POST /api/auth/login
   * Fazer login no sistema
   */
  static async login(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Dados inválidos',
          details: errors.array() 
        });
      }
      
      const { email, senha } = req.body;
      const ip = req.ip || req.connection.remoteAddress;
      const navegador = req.headers['user-agent'];
      
      // Fazer login
      const result = await AuthService.login(email, senha, ip, navegador);
      
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        ...result
      });
      
    } catch (error) {
      return res.status(401).json({
        error: error.message || 'Erro ao fazer login'
      });
    }
  }
  
  /**
   * POST /api/auth/register
   * Registrar novo usuário
   */
  static async register(req, res) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Dados inválidos',
          details: errors.array() 
        });
      }
      
      const usuario = await AuthService.register(req.body);
      
      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        usuario
      });
      
    } catch (error) {
      return res.status(400).json({
        error: error.message || 'Erro ao cadastrar usuário'
      });
    }
  }
  
  /**
   * GET /api/auth/me
   * Obter dados do usuário autenticado
   */
  static async getMe(req, res) {
    try {
      const usuario = await AuthService.getAuthenticatedUser(req.user.id_usuario);
      
      return res.status(200).json({
        usuario
      });
      
    } catch (error) {
      return res.status(404).json({
        error: error.message || 'Usuário não encontrado'
      });
    }
  }
  
  /**
   * POST /api/auth/logout
   * Fazer logout (registra no log)
   */
  static async logout(req, res) {
    try {
      const { id_usuario } = req.user;
      const ip = req.ip || req.connection.remoteAddress;
      const navegador = req.headers['user-agent'];
      
      const UsuarioModel = require('../models/Usuario.model');
      await UsuarioModel.logAccess(id_usuario, ip, navegador, 'logout');
      
      return res.status(200).json({
        message: 'Logout realizado com sucesso'
      });
      
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao fazer logout'
      });
    }
  }
  
  /**
   * POST /api/auth/verify-token
   * Verificar se token é válido
   */
  static verifyToken(req, res) {
    try {
      const token = req.body.token || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(400).json({
          error: 'Token não fornecido'
        });
      }
      
      const decoded = AuthService.verifyToken(token);
      
      return res.status(200).json({
        valid: true,
        usuario: {
          id: decoded.id_usuario,
          email: decoded.email,
          nome: decoded.nome,
          perfil: decoded.perfil
        }
      });
      
    } catch (error) {
      return res.status(401).json({
        valid: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
