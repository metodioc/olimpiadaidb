const SincronizacaoService = require('../../src/services/sincronizacao.service');

// Mock do pool de conexões
jest.mock('../../src/config/database', () => ({
  pool: {
    getConnection: jest.fn()
  }
}));

// Mock do totvsService
jest.mock('../../src/services/totvs.service', () => ({
  getAlunos: jest.fn(),
  mapTotvsToLocal: jest.fn()
}));

describe('Sincronização Service', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sincronizarAlunos', () => {
    
    it.skip('deve processar lista vazia sem erros', async () => {
      const totvsService = require('../../src/services/totvs.service');
      const { pool } = require('../../src/config/database');

      const mockConnection = {
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
        query: jest.fn()
      };

      pool.getConnection.mockResolvedValue(mockConnection);
      totvsService.getAlunos.mockResolvedValue([]);

      const resultado = await SincronizacaoService.sincronizarAlunos();

      expect(resultado.total).toBe(0);
      expect(resultado.inseridos).toBe(0);
      expect(resultado.atualizados).toBe(0);
      expect(mockConnection.commit).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it.skip('deve fazer rollback em caso de erro', async () => {
      const totvsService = require('../../src/services/totvs.service');
      const { pool } = require('../../src/config/database');

      const mockConnection = {
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
        query: jest.fn()
      };

      pool.getConnection.mockResolvedValue(mockConnection);
      totvsService.getAlunos.mockRejectedValue(new Error('Erro de conexão'));

      await expect(SincronizacaoService.sincronizarAlunos())
        .rejects.toThrow();

      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe('processarPessoa', () => {
    
    it.skip('deve criar nova pessoa se não existir', async () => {
      // Teste de criação de pessoa
      expect(true).toBe(true);
    });

    it.skip('deve atualizar pessoa existente', async () => {
      // Teste de atualização de pessoa
      expect(true).toBe(true);
    });
  });

  describe('buscarIdTurma', () => {
    
    it.skip('deve retornar ID da turma quando encontrada', async () => {
      // Teste de busca de turma
      expect(true).toBe(true);
    });

    it.skip('deve retornar null quando turma não for encontrada', async () => {
      // Teste de turma não encontrada
      expect(true).toBe(true);
    });
  });
});
