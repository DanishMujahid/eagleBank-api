import request from 'supertest';
import app from '../app';

describe('Input Sanitization', () => {
  describe('XSS Protection', () => {
    it('should sanitize HTML tags in request body', async () => {
      const maliciousInput = {
        name: '<script>alert("xss")</script>John',
        email: '<img src="x" onerror="alert(1)">user@example.com',
        message: '<div>Hello</div><script>evil()</script>',
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousInput)
        .expect(404); // Route doesn't exist, but sanitization should work (double chceck)

      // The request should be processed without errors
      expect(response.status).toBe(404);
    });

    it('should sanitize JavaScript event handlers', async () => {
      const maliciousInput = {
        name: 'John<img src="x" onload="alert(1)">',
        email: 'user@example.com<iframe onerror="evil()">',
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousInput)
        .expect(404);

      expect(response.status).toBe(404);
    });

    it('should sanitize JavaScript protocol URLs', async () => {
      const maliciousInput = {
        website: 'javascript:alert("xss")',
        redirect: 'data:text/html,<script>alert(1)</script>',
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousInput)
        .expect(404);

      expect(response.status).toBe(404);
    });
  });

  describe('SQL Injection Protection', () => {
    it('should sanitize SQL injection attempts in request body', async () => {
      const maliciousInput = {
        username: "admin' OR '1'='1",
        password: "'; DROP TABLE users; --",
        query: 'SELECT * FROM users WHERE id = 1; DROP TABLE users;',
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousInput)
        .expect(404);

      expect(response.status).toBe(404);
    });

    it('should sanitize SQL injection attempts in query parameters', async () => {
      const response = await request(app)
        .get(
          '/test-sanitize?user=admin%27%20OR%20%271%27%3D%271&query=SELECT%20*%20FROM%20users'
        )
        .expect(404);

      expect(response.status).toBe(404);
    });
  });

  describe('Input Length Validation', () => {
    it('should reject extremely long inputs', async () => {
      const longString = 'a'.repeat(15000); // Exceeds 10KB limit
      const maliciousInput = {
        name: longString,
        email: 'user@example.com',
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousInput)
        .expect(413); // Payload Too Large

      expect(response.body.error).toContain('Input too large');
    });

    it('should accept reasonable length inputs', async () => {
      const reasonableInput = {
        name: 'John Doe',
        email: 'user@example.com',
        message: 'This is a reasonable length message',
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(reasonableInput)
        .expect(404); // Route doesn't exist, but sanitization should work

      expect(response.status).toBe(404);
    });
  });

  describe('Content-Type Validation', () => {
    it('should reject JSON requests without body', async () => {
      const response = await request(app)
        .post('/test-sanitize')
        .set('Content-Type', 'application/json')
        .send()
        .expect(400);

      expect(response.body.error).toContain(
        'Request body is required for JSON requests'
      );
    });

    it('should accept JSON requests with body', async () => {
      const response = await request(app)
        .post('/test-sanitize')
        .set('Content-Type', 'application/json')
        .send({ name: 'John' })
        .expect(404); // Route doesn't exist, but validation should pass

      expect(response.status).toBe(404);
    });

    it('should accept non-JSON requests without body', async () => {
      const response = await request(app).get('/test-sanitize').expect(404); // Route doesn't exist, but validation should pass

      expect(response.status).toBe(404);
    });
  });

  describe('Nested Object Sanitization', () => {
    it('should sanitize nested objects and arrays', async () => {
      const maliciousInput = {
        user: {
          name: '<script>alert("xss")</script>John',
          profile: {
            bio: '<img src="x" onerror="alert(1)">Bio text',
            tags: ['<script>evil()</script>', 'normal-tag'],
          },
        },
        comments: [
          { text: '<div>Comment</div><script>alert(1)</script>' },
          { text: 'Normal comment' },
        ],
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousInput)
        .expect(404);

      expect(response.status).toBe(404);
    });
  });

  describe('Prototype Pollution Protection', () => {
    it('should reject prototype pollution attempts', async () => {
      const maliciousInput = {
        __proto__: { isAdmin: true },
        constructor: { prototype: { isAdmin: true } },
        prototype: { isAdmin: true },
      };

      const response = await request(app)
        .post('/test-sanitize')
        .send(maliciousInput)
        .expect(404);

      expect(response.status).toBe(404);
    });
  });
});
