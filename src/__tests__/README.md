# Testing Guide

This directory contains all the tests for the EagleBank API project.

## Test Structure

```
src/
├── __tests__/              # Test files
│   ├── app.test.ts         # Basic app setup tests
│   └── README.md           # This file
└── test-utils/             # Test utilities and setup
    ├── setup.ts            # Global test setup and teardown
    └── testUtils.ts        # Common testing utilities and mocks
```

## Running Tests

### Available Scripts

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (re-runs on file changes)
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode (no watch, with coverage)

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- app.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="health"
```

## Writing Tests

### Basic Test Structure

```typescript
import request from 'supertest';
import app from '../app';

describe('Feature Name', () => {
  describe('Endpoint /api/feature', () => {
    it('should do something specific', async () => {
      const response = await request(app).get('/api/feature').expect(200);

      expect(response.body).toHaveProperty('expectedProperty');
    });
  });
});
```

### Using Test Utilities

```typescript
import { createMockReqRes, createTestUser } from '../test-utils/testUtils';

describe('Service Test', () => {
  it('should process user data', () => {
    const { req, res, next } = createMockReqRes({
      body: createTestUser(),
    });

    // Test your service/controller here
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );
  });
});
```

## Test Configuration

The Jest configuration is in `jest.config.js` at the project root. Key settings:

- **Preset**: `ts-jest` for TypeScript support
- **Environment**: `node` for server-side testing
- **Coverage**: Excludes server.ts, types, and db files
- **Timeout**: 10 seconds for async tests
- **Setup**: Runs `src/test-utils/setup.ts` before all tests

## Testing Best Practices

1. **Test Structure**: Use descriptive describe blocks and test names
2. **Isolation**: Each test should be independent and not rely on other tests
3. **Mocks**: Use mocks for external dependencies (database, APIs)
4. **Coverage**: Aim for high test coverage, especially for business logic
5. **Async Testing**: Always use async/await for asynchronous operations
6. **Cleanup**: Use beforeEach/afterEach for test setup and cleanup

## Adding New Tests

When you add new endpoints or services:

1. Create test files in the `src/__tests__` directory
2. Use the existing test utilities from `src/test-utils/`
3. Follow the established naming convention: `*.test.ts` or `*.spec.ts`
4. Add integration tests for endpoints and unit tests for services
5. Update the test setup if you need new global configurations

## Database Testing

For database tests, consider:

- Using a separate test database
- Mocking Prisma client for unit tests
- Using transactions for integration tests
- Cleaning up test data between tests

## Example Test Patterns

### Endpoint Testing

```typescript
describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const userData = { name: 'John', email: 'john@example.com' };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject(userData);
  });
});
```

### Service Testing

```typescript
describe('UserService', () => {
  it('should validate user data', () => {
    const invalidUser = { name: '', email: 'invalid-email' };

    expect(() => {
      userService.validateUser(invalidUser);
    }).toThrow('Invalid user data');
  });
});
```
