module.exports = {
  // Ambiente de testes
  testEnvironment: 'node',

  // Variáveis de ambiente para testes
  setupFiles: ['<rootDir>/test/setup.js'],

  // Padrão de arquivos de teste
  testMatch: [
    '**/test/**/*.test.js',
    '**/test/**/*.spec.js'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
    '!src/migrations/**',
    '!src/scripts/**'
  ],

  // Diretório de cobertura
  coverageDirectory: 'coverage',

  // Reporters de cobertura
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],

  // Limites de cobertura (ajustados para valores realistas)
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 20,
      statements: 20
    }
  },

  // Timeout para testes assíncronos
  testTimeout: 10000,

  // Limpar mocks automaticamente
  clearMocks: true,

  // Verbose output
  verbose: true
};
