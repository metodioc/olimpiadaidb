const request = require('supertest');
const app = require('../../src/server');

describe('Sincronização TOTVS Routes', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });
  
  describe('GET /api/sincronizacao/verificar-conexao', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/api/sincronizacao/verificar-conexao');

      expect(response.status).toBe(401);
    });

    it.skip('deve verificar conexão com TOTVS (admin apenas)', async () => {
      // Requer token de admin
      const response = await request(app)
        .get('/api/sincronizacao/verificar-conexao')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('conectado');
    });
  });

  describe('POST /api/sincronizacao/sincronizar', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/sincronizacao/sincronizar')
        .send({});

      expect(response.status).toBe(401);
    });

    it.skip('deve sincronizar alunos (admin apenas)', async () => {
      const response = await request(app)
        .post('/api/sincronizacao/sincronizar')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          idFilial: 1,
          idAnoLetivo: 2025
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('inseridos');
      expect(response.body.data).toHaveProperty('atualizados');
    });
  });

  describe('POST /api/sincronizacao/sincronizar/manual', () => {
    
    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .post('/api/sincronizacao/sincronizar/manual');

      expect(response.status).toBe(401);
    });
  });
});
