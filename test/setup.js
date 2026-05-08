// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.PORT = 5102;
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'user_olimpiada';
process.env.DB_PASSWORD = 'IDBc@mq1';
process.env.DB_NAME = 'olimpiadaidb';

// Silenciar logs durante testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Manter error para debug de testes
  error: console.error,
};
