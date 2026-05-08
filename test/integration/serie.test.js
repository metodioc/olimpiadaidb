const request = require('supertest');
const app = require('../../src/server');

describe('Serie Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/series', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/series');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/series/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/series/1');

      expect(response.status).toBe(401);
    });
  });
});
