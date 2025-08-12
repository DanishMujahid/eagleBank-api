import {
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
  accountCreateSchema,
  accountUpdateSchema,
} from '../middleware/validation';

describe('Validation Schemas', () => {
  describe('userCreateSchema', () => {
    it('should validate valid user data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = userCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        // firstName and lastName missing
      };

      const result = userCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('userLoginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123',
      };

      const result = userLoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing fields', () => {
      const invalidData = {
        email: 'test@example.com',
        // password missing
      };

      const result = userLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('userUpdateSchema', () => {
    it('should validate valid update data', () => {
      const validData = {
        firstName: 'Jane',
        email: 'jane@example.com',
      };

      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty update object', () => {
      const invalidData = {};

      const result = userUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('accountCreateSchema', () => {
    it('should validate valid account data', () => {
      const validData = {
        accountNumber: '12345678',
        currency: 'GBP',
        type: 'CHECKING',
      };

      const result = accountCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid currency', () => {
      const invalidData = {
        accountNumber: '12345678',
        currency: 'INVALID',
        type: 'CHECKING',
      };

      const result = accountCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid account type', () => {
      const invalidData = {
        accountNumber: '12345678',
        currency: 'GBP',
        type: 'INVALID',
      };

      const result = accountCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty account number', () => {
      const invalidData = {
        accountNumber: '',
        currency: 'GBP',
        type: 'CHECKING',
      };

      const result = accountCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('accountUpdateSchema', () => {
    it('should validate valid update data', () => {
      const validData = {
        status: 'SUSPENDED',
        currency: 'USD',
      };

      const result = accountUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty update object', () => {
      const invalidData = {};

      const result = accountUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        status: 'INVALID_STATUS',
      };

      const result = accountUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
