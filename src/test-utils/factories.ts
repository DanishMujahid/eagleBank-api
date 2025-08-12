/**
 * Essential test data helpers for maintainable tests
 */

export interface UserTestData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Create valid user data for testing
 */
export const createValidUserData = (
  overrides: Partial<UserTestData> = {}
): UserTestData => ({
  email: 'test@example.com',
  password: 'SecurePass123',
  firstName: 'Test',
  lastName: 'User',
  ...overrides,
});

/**
 * Create invalid user data for common validation scenarios
 */
export const createInvalidUserData = (
  type: 'missing-fields' | 'weak-password' | 'invalid-email'
): Partial<UserTestData> => {
  switch (type) {
    case 'missing-fields':
      return {
        email: 'incomplete@example.com',
        // Missing password, firstName, lastName
      };

    case 'weak-password':
      return {
        email: 'weak@example.com',
        password: 'weak', // Too short, no uppercase, no numbers
        firstName: 'Weak',
        lastName: 'User',
      };

    case 'invalid-email':
      return {
        email: 'invalid-email',
        password: 'SecurePass123',
        firstName: 'Invalid',
        lastName: 'Email',
      };

    default:
      return createValidUserData();
  }
};

/**
 * Create malicious data for security testing
 */
export const createMaliciousData = (type: 'sql-injection' | 'xss'): any => {
  switch (type) {
    case 'sql-injection':
      return {
        email: "'; DROP TABLE users; --",
        password: 'SecurePass123',
        firstName: 'Test',
        lastName: 'User',
      };

    case 'xss':
      return {
        email: 'xss@example.com',
        password: 'SecurePass123',
        firstName: '<script>alert("XSS")</script>',
        lastName: 'User',
      };

    default:
      return createValidUserData();
  }
};
