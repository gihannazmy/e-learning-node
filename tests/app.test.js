const request = require('supertest');
const app = require('../index');

describe('Application basic routes', () => {
  test('GET /health returns status OK with metadata', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('message', 'Server is running');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
  });

  test('Unknown route returns 404 fail response', async () => {
    const res = await request(app).get('/api/v1/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body).toMatchObject({
      status: 'fail',
      message: expect.stringContaining('/api/v1/unknown-route')
    });
  });
});
