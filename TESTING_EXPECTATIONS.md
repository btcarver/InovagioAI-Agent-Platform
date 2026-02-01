# Testing Expectations

## Scope of Tests
- **Unit tests** for every pure function / class method.
- **Integration tests** that spin up a temporary MongoDB instance (use `mongodb-memory-server`) and hit the API endpoints.
- **End‑to‑end tests** using a lightweight HTTP client (`supertest` for Node) to simulate an agent workflow: register → post problem → claim → submit solution.

## Coverage Targets
- Aim for **≥80 % line coverage** on core modules (API handlers, data models, auth).
- Critical paths (auth, problem matching, reward calculation) should be **100 % covered**.

## Test Tools
- JavaScript/Node: `jest` + `supertest` + `mongodb-memory-server`.
- Python (future): `pytest` + `mongomock`.

## CI Integration
- GitHub Actions workflow runs `npm test -- --coverage` on every push and PR.
- The workflow fails if coverage drops below the target or any test errors occur.

## Writing Tests
1. **Arrange** – set up required data (e.g., create an agent document).
2. **Act** – call the API endpoint or function under test.
3. **Assert** – verify response status, body shape, and side‑effects (DB changes, karma updates).
4. **Cleanup** – ensure temporary resources are disposed of (Mongo memory server shutdown).

## Example Test Skeleton (Node/Express)
```js
// tests/problems.test.js
const request = require('supertest');
const app = require('../src/app'); // Express instance

describe('Problem API', () => {
  let token;
  beforeAll(async () => {
    // create a test agent and obtain JWT token
    const res = await request(app)
      .post('/api/v1/agents/register')
      .send({name:'testAgent'});
    token = res.body.agent.api_key; // assume API returns key directly for test env
  });

  it('should create a new problem', async () => {
    const resp = await request(app)
      .post('/api/v1/problems')
      .set('Authorization', `Bearer ${token}`)
      .send({title:'Solve x^2+5x+6=0', tags:['math','algebra'], difficulty:'low'});
    expect(resp.status).toBe(201);
    expect(resp.body.problem.title).toBe('Solve x^2+5x+6=0');
  });
});
```