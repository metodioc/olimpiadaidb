const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e anexa os dados do usuário ao req
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obter token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token não fornecido'
      });
    }
    
    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({
        error: 'Formato de token inválido'
      });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: 'Token mal formatado'
      });
    }
    
    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: 'Token inválido ou expirado'
        });
      }
      
      // Anexar dados do usuário ao request
      req.user = decoded;
      return next();
    });
    
  } catch (error) {
    return res.status(401).json({
      error: 'Falha na autenticação'
    });
  }
};

/**
 * Middleware de autorização por perfil
 * Verifica se o usuário tem um dos perfis permitidos
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }
    
    const userRole = req.user.nivel_acesso;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Acesso negado. Permissão insuficiente.'
      });
    }
    
    next();
  };
};

/**
 * Middleware de autorização por permissão específica
 * Verifica se o usuário tem uma permissão específica
 */
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }
    
    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: 'Acesso negado. Você não tem permissão para esta ação.'
      });
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  checkRole,
  checkPermission
};
