const { pool } = require('../config/database');

/**
 * Model para gerenciar Usuários
 */
class UsuarioModel {
  
  /**
   * Listar todos os usuários
   */
  static async findAll(filters = {}) {
    const { perfil, ativo, search } = filters;
    
    let query = `
      SELECT 
        u.id_usuario,
        u.id_perfil,
        u.nome_completo,
        u.email,
        u.cpf,
        u.telefone,
        u.ativo,
        u.ultimo_acesso,
        p.nome_perfil,
        p.nivel_acesso
      FROM tb_usuario u
      INNER JOIN tb_perfil p ON u.id_perfil = p.id_perfil
      WHERE 1=1
    `;
    
    const params = [];
    
    if (perfil) {
      query += ' AND u.id_perfil = ?';
      params.push(perfil);
    }
    
    if (ativo !== undefined && ativo !== '') {
      query += ' AND u.ativo = ?';
      params.push(ativo === 'true' || ativo === true || ativo === 1);
    }
    
    if (search) {
      query += ' AND (u.nome_completo LIKE ? OR u.email LIKE ? OR u.cpf LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY u.nome_completo ASC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Buscar usuário por email
   */
  static async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT 
        u.id_usuario,
        u.id_perfil,
        u.nome_completo,
        u.email,
        u.senha,
        u.cpf,
        u.telefone,
        u.ativo,
        p.nome_perfil,
        p.nivel_acesso
      FROM tb_usuario u
      INNER JOIN tb_perfil p ON u.id_perfil = p.id_perfil
      WHERE u.email = ? AND u.ativo = TRUE`,
      [email]
    );
    return rows[0];
  }
  
  /**
   * Buscar usuário por ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        u.id_usuario,
        u.id_perfil,
        u.nome_completo,
        u.email,
        u.cpf,
        u.telefone,
        u.ativo,
        u.ultimo_acesso,
        p.nome_perfil,
        p.nivel_acesso
      FROM tb_usuario u
      INNER JOIN tb_perfil p ON u.id_perfil = p.id_perfil
      WHERE u.id_usuario = ?`,
      [id]
    );
    return rows[0];
  }
  
  /**
   * Buscar permissões do usuário
   */
  static async getUserPermissions(userId) {
    const [rows] = await pool.query(
      `SELECT pm.nome_permissao
      FROM tb_usuario u
      INNER JOIN tb_perfil_permissao pp ON u.id_perfil = pp.id_perfil
      INNER JOIN tb_permissao pm ON pp.id_permissao = pm.id_permissao
      WHERE u.id_usuario = ?`,
      [userId]
    );
    return rows.map(row => row.nome_permissao);
  }
  
  /**
   * Criar novo usuário
   */
  static async create(userData) {
    const { id_perfil, nome_completo, email, senha, cpf, telefone } = userData;
    
    const [result] = await pool.query(
      `INSERT INTO tb_usuario 
        (id_perfil, nome_completo, email, senha, cpf, telefone) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id_perfil, nome_completo, email, senha, cpf, telefone]
    );
    
    return result.insertId;
  }
  
  /**
   * Atualizar último acesso
   */
  static async updateLastAccess(userId) {
    await pool.query(
      'UPDATE tb_usuario SET ultimo_acesso = NOW() WHERE id_usuario = ?',
      [userId]
    );
  }

  /**
   * Atualizar usuário
   */
  static async update(id, userData) {
    const fields = [];
    const values = [];
    
    if (userData.id_perfil) {
      fields.push('id_perfil = ?');
      values.push(userData.id_perfil);
    }
    if (userData.nome_completo) {
      fields.push('nome_completo = ?');
      values.push(userData.nome_completo);
    }
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.senha) {
      fields.push('senha = ?');
      values.push(userData.senha);
    }
    if (userData.cpf !== undefined) {
      fields.push('cpf = ?');
      values.push(userData.cpf);
    }
    if (userData.telefone !== undefined) {
      fields.push('telefone = ?');
      values.push(userData.telefone);
    }
    if (userData.ativo !== undefined) {
      fields.push('ativo = ?');
      values.push(userData.ativo);
    }
    
    if (fields.length === 0) {
      return;
    }
    
    values.push(id);
    
    await pool.query(
      `UPDATE tb_usuario SET ${fields.join(', ')} WHERE id_usuario = ?`,
      values
    );
  }

  /**
   * Desativar usuário
   */
  static async deactivate(id) {
    await pool.query(
      'UPDATE tb_usuario SET ativo = FALSE WHERE id_usuario = ?',
      [id]
    );
  }

  /**
   * Alternar status ativo/inativo
   */
  static async toggleStatus(id) {
    await pool.query(
      'UPDATE tb_usuario SET ativo = NOT ativo WHERE id_usuario = ?',
      [id]
    );
  }
  
  /**
   * Registrar log de acesso
   */
  static async logAccess(userId, ip, navegador, acao) {
    await pool.query(
      `INSERT INTO tb_log_acesso 
        (id_usuario, ip_acesso, navegador, acao) 
      VALUES (?, ?, ?, ?)`,
      [userId, ip, navegador, acao]
    );
  }
}

module.exports = UsuarioModel;
