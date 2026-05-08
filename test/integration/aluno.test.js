const request = require('supertest');
const app = require('../../src/server');

describe('Aluno Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/alunos', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/alunos');

      expect(response.status).toBe(401);
    });

    it.skip('deve retornar lista de alunos com autenticação', async () => {
      const response = await request(app)
        .get('/api/alunos')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/alunos/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/alunos/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/alunos', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/alunos')
        .send({
          ra: '123456',
          situacao: 'Matriculado'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/alunos/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .put('/api/alunos/1')
        .send({
          situacao: 'Inativo'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/alunos/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .delete('/api/alunos/1');

      expect(response.status).toBe(401);
    });
  });
});
