const request = require('supertest');
const app = require('../../src/server');

describe('Health Check', () => {
  
  beforeAll((done) => {
    setTimeout(done, 1000);
  });
  
  it('deve retornar status 200 no health check', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  it('deve retornar uptime maior que zero', async () => {
    const response = await request(app).get('/health');

    expect(response.body.uptime).toBeGreaterThan(0);
  });

  it('deve retornar timestamp válido', async () => {
    const response = await request(app).get('/health');

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).toBeGreaterThan(0);
  });
});

describe('404 Handler', () => {
  
  it('deve retornar 404 para rota inexistente', async () => {
    const response = await request(app).get('/rota-que-nao-existe');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('deve retornar path da rota não encontrada', async () => {
    const response = await request(app).get('/api/rota-invalida');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('path', '/api/rota-invalida');
  });
});
