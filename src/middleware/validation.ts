import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { createError } from './errorHandler';
import { validatePasswordStrength } from '../utils/password';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the sanitized request body
      const validatedData = schema.parse(req.body);

      // Replace the request body with validated data
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract all validation error messages and join them
        const message = error.errors.map(e => e.message).join(', ');
        next(createError(`Validation failed: ${message}`, 400));
      } else {
        // Fallback for unexpected errors
        next(createError('Validation failed', 400));
      }
    }
  };
};

export const validateRequestWithQuery = (
  bodySchema: z.ZodSchema,
  querySchema: z.ZodSchema
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate body
      if (bodySchema) {
        const validatedBody = bodySchema.parse(req.body);
        req.body = validatedBody;
      }

      // Validate query parameters
      if (querySchema) {
        const validatedQuery = querySchema.parse(req.query);
        req.query = validatedQuery;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map(e => e.message).join(', ');
        next(createError(`Validation failed: ${message}`, 400));
      } else {
        next(createError('Validation failed', 400));
      }
    }
  };
};

// Custom password validation for Zod
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be less than 128 characters')
  .refine(password => {
    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    return true;
  }, 'Password does not meet strength requirements');

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: passwordSchema,
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const userUpdateSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name too long')
      .optional(),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name too long')
      .optional(),
    email: z
      .string()
      .email('Invalid email format')
      .min(1, 'Email is required')
      .optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const accountCreateSchema = z.object({
  accountNumber: z
    .string()
    .min(1, 'Account number is required')
    .max(20, 'Account number too long'),
  currency: z.enum(['GBP', 'USD', 'EUR'], {
    message: 'Invalid currency. Must be GBP, USD, or EUR',
  }),
  type: z.enum(['CHECKING', 'SAVINGS', 'BUSINESS'], {
    message: 'Invalid account type',
  }),
});

export const transactionCreateSchema = z.object({
  amount: z
    .number()
    .finite('Amount must be a valid number')
    .refine(val => val !== 0, 'Amount cannot be zero'),
  type: z.enum(['DEBIT', 'CREDIT', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT'], {
    message: 'Invalid transaction type',
  }),
  description: z.string().max(500, 'Description too long').optional(),
  accountId: z.string().min(1, 'Account ID is required'),
});
