const request = require('supertest');
const app = require('../../src/server');

describe('Olimpiada Routes', () => {
  let authToken;
  let olimpiadaId;

  // Setup: fazer login antes dos testes
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  describe('GET /api/olimpiadas', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/olimpiadas');

      expect(response.status).toBe(401);
    });

    it.skip('deve retornar lista de olimpíadas com autenticação', async () => {
      const response = await request(app)
        .get('/api/olimpiadas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it.skip('deve retornar olimpíadas filtradas por status', async () => {
      const response = await request(app)
        .get('/api/olimpiadas?status=ativo')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/olimpiadas/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/olimpiadas/99999');

      expect(response.status).toBe(401);
    });

    it.skip('deve retornar erro 404 para olimpíada inexistente', async () => {
      const response = await request(app)
        .get('/api/olimpiadas/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it.skip('deve retornar dados de uma olimpíada específica', async () => {
      const response = await request(app)
        .get('/api/olimpiadas/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('idOlimpiada');
    });
  });

  describe('POST /api/olimpiadas', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/olimpiadas')
        .send({
          titulo: 'Nova Olimpíada',
          descricao: 'Descrição teste'
        });

      expect(response.status).toBe(401);
    });

    it.skip('deve criar olimpíada com dados válidos', async () => {
      const novaOlimpiada = {
        titulo: 'Olimpíada de Matemática 2025',
        descricao: 'Competição de matemática',
        status: 'ativo',
        idAnoLetivo: 1,
        idTipoCorrecao: 1,
        idLocalAplicacao: 1,
        idTipoPagamento: 1
      };

      const response = await request(app)
        .post('/api/olimpiadas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(novaOlimpiada);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      olimpiadaId = response.body.data.idOlimpiada;
    });
  });

  describe('PUT /api/olimpiadas/:id', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .put('/api/olimpiadas/1')
        .send({ titulo: 'Título Atualizado' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/olimpiadas/:id', () => {
    
    it.skip('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .delete('/api/olimpiadas/1');

      expect(response.status).toBe(401);
    });
  });
});

// Helper para obter token de autenticação
async function getAuthToken() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@teste.com',
      senha: 'senha123'
    });
  
  return response.body.data.token;
}
