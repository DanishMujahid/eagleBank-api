import { Request, Response, NextFunction } from 'express';

// Mock Express request, response, and next function
export const createMockRequest = (
  overrides: Partial<Request> = {}
): Partial<Request> => ({
  method: 'GET',
  url: '/test',
  headers: {},
  body: {},
  params: {},
  query: {},
  ...overrides,
});

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = (): NextFunction => jest.fn();

// Helper to create a complete mock request/response pair
export const createMockReqRes = (overrides: Partial<Request> = {}) => ({
  req: createMockRequest(overrides),
  res: createMockResponse(),
  next: createMockNext(),
});

// Reset all mocks
export const resetMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

// Test data factories
export const createTestUser = (overrides: any = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
