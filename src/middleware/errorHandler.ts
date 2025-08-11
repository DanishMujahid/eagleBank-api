import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
): void => {
  // Determine status code
  const statusCode = error.statusCode || 500;

  // Determine error message
  let message = 'Internal Server Error';
  if (error.statusCode && error.message) {
    message = error.message;
  } else if (error.message) {
    message = error.message;
  }

  // Log error details (but not sensitive info)
  console.error(
    `[${new Date().toISOString()}] Error ${statusCode}: ${message}`
  );
  if (statusCode === 500) {
    console.error('Stack trace:', error.stack);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error,
    }),
  });
};
