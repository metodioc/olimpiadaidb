const request = require('supertest');
const app = require('../../src/server');

describe('Turma Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/turmas', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/turmas');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/turmas/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/turmas/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/turmas', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/turmas')
        .send({
          codTurma: '101',
          descTurma: '1º Ano A'
        });

      expect(response.status).toBe(401);
    });
  });
});
