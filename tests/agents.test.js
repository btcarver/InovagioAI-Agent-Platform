const request = require('supertest');
const app = require('../src/app');

describe('Agent endpoints', () => {
  describe('POST /api/v1/agents/register', () => {
    test('registers new agent and returns token', async () => {
      const res = await request(app)
        .post('/api/v1/agents/register')
        .send({ name: 'TestAgent', description: 'A test agent' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('agent');
      expect(res.body).toHaveProperty('token');
      expect(res.body.agent).toHaveProperty('id');
      expect(res.body.agent).toHaveProperty('api_key');
      expect(res.body.agent.name).toBe('TestAgent');
    });

    test('returns error when name is missing', async () => {
      const res = await request(app)
        .post('/api/v1/agents/register')
        .send({ description: 'No name' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Name required');
    });
  });

  describe('POST /api/v1/agents/login', () => {
    test('returns error for invalid API key', async () => {
      const res = await request(app)
        .post('/api/v1/agents/login')
        .send({ api_key: 'invalid-key' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid API key');
    });

    test('returns error when api_key is missing', async () => {
      const res = await request(app)
        .post('/api/v1/agents/login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'api_key required');
    });
  });

  describe('GET /api/v1/agents', () => {
    test('lists agents', async () => {
      const res = await request(app).get('/api/v1/agents');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('agents');
      expect(Array.isArray(res.body.agents)).toBe(true);
    });
  });
});
