import request from 'supertest';
import app from '../app';

describe('User Endpoints', () => {
  describe('POST /v1/users', () => {
    it('should return 400 when required fields are missing', async () => {
      const userData = {
        email: 'incomplete@example.com',
        // Missing password, firstName, lastName
      };

      const response = await request(app)
        .post('/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when password is too weak', async () => {
      const userData = {
        email: 'weak@example.com',
        password: 'weak',
        firstName: 'Weak',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      // The error message should indicate validation failure
      expect(response.body.error).toContain('Validation failed');
    });

    it('should return 400 when email format is invalid', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'ValidPassword123',
        firstName: 'Valid',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('email');
    });
  });

  describe('POST /v1/auth/login', () => {
    it('should return 400 when login data is invalid', async () => {
      const loginData = {
        email: 'invalid-email',
        // Missing password
      };

      const response = await request(app)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when email format is invalid', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/v1/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('email');
    });
  });
});
