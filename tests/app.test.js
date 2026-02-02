const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  test('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status','ok');
  });
});
