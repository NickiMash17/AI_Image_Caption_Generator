const request = require('supertest');
const express = require('express');
const app = require('./server');

jest.mock('node-fetch');
const fetch = require('node-fetch');

// Helper to reset mocks
beforeEach(() => {
  fetch.mockReset();
});

describe('POST /api/caption', () => {
  it('should return 400 if no image is provided', async () => {
    const res = await request(app).post('/api/caption').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('No image provided.');
  });

  it('should return a caption if image is provided and OpenAI responds', async () => {
    fetch.mockResolvedValue({
      json: async () => ({
        choices: [
          { message: { content: 'A test caption.' } }
        ]
      })
    });
    // Patch app to not actually listen
    const testApp = express();
    testApp.use(express.json({ limit: '10mb' }));
    testApp.post('/api/caption', app._router.stack[2].handle);
    const res = await request(testApp)
      .post('/api/caption')
      .send({ image: 'fakebase64' });
    expect(res.statusCode).toBe(200);
    expect(res.body.caption).toBe('A test caption.');
  });
}); 