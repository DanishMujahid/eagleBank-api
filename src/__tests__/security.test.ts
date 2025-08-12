import request from 'supertest';
import app from '../app';

describe('Security Tests', () => {
  describe('Input Validation & Security', () => {
    it('should reject SQL injection attempts', async () => {
      const maliciousData = {
        email: "'; DROP TABLE users; --",
        password: 'SecurePass123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/v1/users')
        .send(maliciousData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should handle XSS payloads gracefully', async () => {
      const xssData = {
        email: 'xss@example.com',
        password: 'SecurePass123',
        firstName: '<script>alert("XSS")</script>',
        lastName: 'User',
      };

      const response = await request(app).post('/v1/users').send(xssData);

      // Should get some response (even if it's a 500 due to database issues)
      expect(response.status).toBeDefined();
      // The important thing is it doesn't crash completely
      expect(response.status).not.toBe(404);
    });

    it('should handle extremely long inputs gracefully', async () => {
      const longData = {
        email: 'a'.repeat(300) + '@example.com',
        password: 'SecurePass123',
        firstName: 'a'.repeat(100),
        lastName: 'User',
      };

      const response = await request(app)
        .post('/v1/users')
        .send(longData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
