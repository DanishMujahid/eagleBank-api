/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  (globalThis as any).__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__prisma = prisma;
}

export default prisma;
