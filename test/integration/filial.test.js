const request = require('supertest');
const app = require('../../src/server');

describe('Filial Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/filiais', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/filiais');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/filiais/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/filiais/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/filiais', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .send({
          nomeFilial: 'Unidade Centro'
        });

      expect(response.status).toBe(401);
    });
  });
});
