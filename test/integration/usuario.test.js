const request = require('supertest');
const app = require('../../src/server');

describe('Usuario Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/usuarios', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/usuarios/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/usuarios/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/usuarios', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/usuarios')
        .send({
          nome_completo: 'Teste Usuario',
          email: 'teste@email.com'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .put('/api/usuarios/1')
        .send({
          nome_completo: 'Nome Atualizado'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .delete('/api/usuarios/1');

      expect(response.status).toBe(401);
    });
  });
});
