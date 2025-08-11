import { PrismaClient } from '@prisma/client';

declare global {
  // Use 'any' to avoid type errors if PrismaClient is not exported directly
  // or import PrismaClient from the default export if available
  // @ts-ignore
  var __prisma: any;
}

export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
