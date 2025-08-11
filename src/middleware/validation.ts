import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { createError } from "./errorHandler";

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e) => e.message).join(", ");
        next(createError(`Validation failed: ${message}`, 400));
      } else {
        next(createError("Validation failed", 400));
      }
    }
  };
};

// Validation schema
export const userCreateSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
