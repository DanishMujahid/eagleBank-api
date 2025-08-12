// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'file:./test.db';
  process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.PORT = '3001';
});

// Global test teardown
afterAll(async () => {
  // Clean up any test resources if needed
});

// Reset mocks between tests
beforeEach(async () => {
  // Clear any test data if needed
  // This can be customized based on your testing needs
});

afterEach(async () => {
  // Clean up after each test
  // This can be customized based on your testing needs
});
