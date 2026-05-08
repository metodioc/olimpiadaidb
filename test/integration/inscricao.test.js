const request = require('supertest');
const app = require('../../src/server');

describe('Inscricao Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/inscricoes', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/inscricoes');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/inscricoes/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/inscricoes/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/inscricoes', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/inscricoes')
        .send({
          idOlimpiada: 1,
          idAluno: 1
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/inscricoes/lote', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/inscricoes/lote')
        .send({
          idOlimpiada: 1,
          modo: 'turma',
          idTurma: 1
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/inscricoes/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .delete('/api/inscricoes/1');

      expect(response.status).toBe(401);
    });
  });
});
