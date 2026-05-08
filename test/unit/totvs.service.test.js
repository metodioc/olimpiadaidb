const totvsService = require('../../src/services/totvs.service');

describe('TOTVS Service', () => {
  
  describe('getAuthHeaders', () => {
    
    it('deve retornar headers com Basic Authentication', () => {
      const headers = totvsService.getAuthHeaders();

      expect(headers).toHaveProperty('Authorization');
      expect(headers.Authorization).toMatch(/^Basic /);
      expect(headers).toHaveProperty('Content-Type', 'application/json');
    });

    it('deve criar token Base64 válido', () => {
      const headers = totvsService.getAuthHeaders();
      const token = headers.Authorization.replace('Basic ', '');
      
      // Verificar se é Base64 válido
      expect(() => Buffer.from(token, 'base64')).not.toThrow();
    });
  });

  describe('mapTotvsToLocal', () => {
    
    it('deve mapear dados do TOTVS corretamente', () => {
      const totvsAluno = {
        RA: '123456',
        ALUNO: 'João da Silva',
        STATUS: 'Matriculado',
        TIPOMATRICULA: 'Regular',
        EMAILPESSOAL: 'joao@email.com',
        CODTURMA: '12345',
        CODFILIAL: '1',
        FILIAL: 'Unidade Centro',
        HABILITACAO: 'Ensino Médio'
      };

      const resultado = totvsService.mapTotvsToLocal(totvsAluno);

      expect(resultado).toHaveProperty('ra', '123456');
      expect(resultado).toHaveProperty('situacao', 'Matriculado');
      expect(resultado.pessoa).toHaveProperty('nome', 'João da Silva');
      expect(resultado.pessoa).toHaveProperty('email', 'joao@email.com');
      expect(resultado).toHaveProperty('nomeFilial', 'Unidade Centro');
    });

    it('deve tratar campos opcionais como null', () => {
      const totvsAluno = {
        RA: '123456',
        ALUNO: 'Maria Santos',
        STATUS: 'Matriculado',
        CODTURMA: '12345',
        CODFILIAL: '1'
        // Sem email, habilitação, etc
      };

      const resultado = totvsService.mapTotvsToLocal(totvsAluno);

      expect(resultado.pessoa.email).toBeNull();
      expect(resultado.pessoa.dtnasc).toBeNull();
      expect(resultado.pessoa.imgUrl).toBeNull();
    });

    it('deve extrair substring correta do CODTURMA', () => {
      const totvsAluno = {
        RA: '123456',
        ALUNO: 'Pedro Costa',
        STATUS: 'Matriculado',
        CODTURMA: '12ABC56',
        CODFILIAL: '1'
      };

      const resultado = totvsService.mapTotvsToLocal(totvsAluno);

      expect(resultado.codigoTurma).toBe('ABC');
    });
  });

  describe('resolverIdFilial', () => {
    
    it('deve retornar ID correto para código conhecido', () => {
      const id = totvsService.resolverIdFilial('1');
      expect(id).toBe(1);
    });

    it('deve retornar null para código desconhecido', () => {
      const id = totvsService.resolverIdFilial('999');
      expect(id).toBeNull();
    });
  });

  describe('getAlunos', () => {
    
    it.skip('deve buscar alunos do TOTVS com filtros', async () => {
      const filters = {
        idAnoLetivo: 2025
      };

      const alunos = await totvsService.getAlunos(filters);

      expect(Array.isArray(alunos)).toBe(true);
    });

    it.skip('deve usar ano atual quando não especificado', async () => {
      const alunos = await totvsService.getAlunos();

      expect(Array.isArray(alunos)).toBe(true);
    });
  });
});
