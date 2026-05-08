const request = require('supertest');
const app = require('../../src/server');

describe('Resultado Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/resultados', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/resultados');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/resultados/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/resultados/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/resultados', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/resultados')
        .send({
          idInscricao: 1,
          nota: 85
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/resultados/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .put('/api/resultados/1')
        .send({
          nota: 90
        });

      expect(response.status).toBe(401);
    });
  });
});
