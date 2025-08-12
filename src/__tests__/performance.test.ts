import request from 'supertest';
import app from '../app';

describe('Performance Tests', () => {
  describe('Response Time & Stability', () => {
    it('should respond to requests within reasonable time', async () => {
      const userData = {
        email: 'perf@example.com',
        password: 'SecurePass123',
        firstName: 'Performance',
        lastName: 'Test',
      };

      const start = Date.now();
      const response = await request(app).post('/v1/users').send(userData);

      const duration = Date.now() - start;

      // Should respond within 2 seconds (reasonable for validation + database)
      expect(duration).toBeLessThan(2000);
      expect(response.status).toBeDefined();
    });

    it('should handle malformed JSON requests quickly', async () => {
      const start = Date.now();
      const response = await request(app)
        .post('/v1/users')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      const duration = Date.now() - start;

      // Malformed JSON should be rejected very quickly
      expect(duration).toBeLessThan(500);
      expect(response.body.success).toBe(false);
    });

    it('should not crash with large payloads', async () => {
      const largeData = {
        email: 'large@example.com',
        password: 'SecurePass123',
        firstName: 'a'.repeat(1000), // Very long name
        lastName: 'User',
      };

      const start = Date.now();
      const response = await request(app).post('/v1/users').send(largeData);

      const duration = Date.now() - start;

      // Should handle large payloads gracefully
      expect(duration).toBeLessThan(2000);
      expect(response.status).toBeDefined(); // Should get some response
    });
  });
});
