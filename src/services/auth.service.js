const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/Usuario.model');

/**
 * Service de Autenticação
 * Contém toda lógica de negócio relacionada à autenticação
 */
class AuthService {
  
  /**
   * Fazer login
   */
  static async login(email, senha, ip, navegador) {
    try {
      // Buscar usuário por email
      const usuario = await UsuarioModel.findByEmail(email);
      
      if (!usuario) {
        // Log de tentativa falha
        await UsuarioModel.logAccess(null, ip, navegador, 'tentativa_falha_usuario_inexistente');
        throw new Error('Email ou senha inválidos');
      }
      
      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        // Log de tentativa falha
        await UsuarioModel.logAccess(usuario.id_usuario, ip, navegador, 'tentativa_falha_senha_incorreta');
        throw new Error('Email ou senha inválidos');
      }
      
      // Buscar permissões do usuário
      const permissions = await UsuarioModel.getUserPermissions(usuario.id_usuario);
      
      // Gerar token JWT
      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          email: usuario.email,
          nome: usuario.nome_completo,
          perfil: usuario.nome_perfil,
          nivel_acesso: usuario.nivel_acesso,
          permissions
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );
      
      // Atualizar último acesso
      await UsuarioModel.updateLastAccess(usuario.id_usuario);
      
      // Log de login bem-sucedido
      await UsuarioModel.logAccess(usuario.id_usuario, ip, navegador, 'login');
      
      return {
        token,
        usuario: {
          id: usuario.id_usuario,
          nome: usuario.nome_completo,
          email: usuario.email,
          perfil: usuario.nome_perfil,
          nivel_acesso: usuario.nivel_acesso
        }
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Registrar novo usuário
   */
  static async register(userData) {
    try {
      const { id_perfil, nome_completo, email, senha, cpf, telefone } = userData;
      
      // Verificar se email já existe
      const usuarioExistente = await UsuarioModel.findByEmail(email);
      
      if (usuarioExistente) {
        throw new Error('Email já cadastrado no sistema');
      }
      
      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
      
      // Criar usuário
      const userId = await UsuarioModel.create({
        id_perfil,
        nome_completo,
        email,
        senha: senhaHash,
        cpf,
        telefone
      });
      
      // Buscar usuário criado
      const novoUsuario = await UsuarioModel.findById(userId);
      
      return {
        id: novoUsuario.id_usuario,
        nome: novoUsuario.nome_completo,
        email: novoUsuario.email,
        perfil: novoUsuario.nome_perfil
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Verificar token JWT
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
  
  /**
   * Buscar dados do usuário autenticado
   */
  static async getAuthenticatedUser(userId) {
    try {
      const usuario = await UsuarioModel.findById(userId);
      
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      const permissions = await UsuarioModel.getUserPermissions(userId);
      
      return {
        id: usuario.id_usuario,
        nome: usuario.nome_completo,
        email: usuario.email,
        cpf: usuario.cpf,
        telefone: usuario.telefone,
        perfil: usuario.nome_perfil,
        nivel_acesso: usuario.nivel_acesso,
        ultimo_acesso: usuario.ultimo_acesso,
        permissions
      };
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
