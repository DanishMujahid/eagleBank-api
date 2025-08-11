import request from 'supertest';
import app from '../app';

describe('App Setup', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });

  describe('Middleware Configuration', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app).get('/health').expect(200);

      // Check if CORS headers are present
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle malformed JSON gracefully', async () => {
      // Test that the app can handle malformed JSON requests
      // Express will return 400 for malformed JSON before it reaches our 404 handler
      const response = await request(app)
        .post('/non-existent-route')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      // The response should indicate a JSON parsing error
      expect(response.body).toBeDefined();
    });
  });
});
