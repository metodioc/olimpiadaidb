const request = require('supertest');
const app = require('../../src/server');

describe('Auth Routes', () => {
  
  // Aguardar app estar pronto
  beforeAll((done) => {
    setTimeout(done, 1000);
  });
  
  describe('POST /api/auth/login', () => {
    
    it('deve retornar erro 400 quando credenciais não forem fornecidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('deve retornar erro 400 quando email for inválido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'email-invalido',
          senha: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Dados inválidos');
      expect(response.body).toHaveProperty('details');
    });

    it.skip('deve retornar erro 401 para credenciais incorretas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'usuario@naoexiste.com',
          senha: 'senhaerrada123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    // Teste com credenciais válidas (ajuste conforme seu banco de testes)
    it.skip('deve retornar token JWT com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@olimpiada.com',
          senha: 'senha123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('usuario');
    });
  });

  describe('POST /api/auth/refresh', () => {
    
    it.skip('deve retornar erro 401 quando token não for fornecido', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
