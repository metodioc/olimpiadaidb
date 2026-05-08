const request = require('supertest');
const app = require('../../src/server');

describe('AnoLetivo Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/anos-letivos', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/anos-letivos');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/anos-letivos/ativo', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/anos-letivos/ativo');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/anos-letivos', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/anos-letivos')
        .send({
          anoLetivo: 2025,
          status: 'ativo'
        });

      expect(response.status).toBe(401);
    });
  });
});
