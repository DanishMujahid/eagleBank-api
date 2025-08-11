import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

/**
 * Sanitization middleware to protect against XSS and injection attacks.
 *
 * This middleware:
 * - Sanitizes request body, query parameters, and URL parameters
 * - Removes potentially dangerous HTML/script tags
 * - Escapes special characters that could cause injection
 * - Validates input lengths and formats
 */

/**
 * Removes HTML tags and potentially dangerous content from strings.
 *
 * @param input - String to sanitize
 * @returns Sanitized string
 */
const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return input;

  return (
    input
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove JavaScript event handlers
      .replace(/\bon\w+\s*=/gi, '')
      // Remove JavaScript protocol
      .replace(/javascript:/gi, '')
      // Remove data URLs
      .replace(/data:/gi, '')
      // Remove vbscript
      .replace(/vbscript:/gi, '')
      // Remove onload, onerror, etc.
      .replace(/\bon\w+\s*\(/gi, '')
      // Escape quotes
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // Escape ampersands
      .replace(/&/g, '&amp;')
      // Escape less than and greater than
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Trim whitespace
      .trim()
  );
};

/**
 * Recursively sanitizes objects and arrays.
 *
 * @param data - Data to sanitize (object, array, or primitive)
 * @returns Sanitized data
 */
const sanitizeData = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Sanitize the key as well
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeData(value);
    }
    return sanitized;
  }

  return data;
};

/**
 * Validates input lengths to prevent buffer overflow attacks.
 *
 * @param data - Data to validate
 * @param maxLength - Maximum allowed length
 * @returns True if valid, false otherwise
 */
const validateInputLength = (data: any, maxLength: number = 10000): boolean => {
  if (typeof data === 'string') {
    return data.length <= maxLength;
  }

  if (Array.isArray(data)) {
    return data.every(item => validateInputLength(item, maxLength));
  }

  if (typeof data === 'object' && data !== null) {
    return Object.values(data).every(value =>
      validateInputLength(value, maxLength)
    );
  }

  return true;
};

/**
 * Main sanitization middleware.
 *
 * Sanitizes request body, query parameters, and URL parameters
 * to protect against XSS and injection attacks.
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Sanitize request body
    if (req.body && Object.keys(req.body).length > 0) {
      // Validate input length first
      if (!validateInputLength(req.body)) {
        throw createError('Input too large', 413);
      }
      req.body = sanitizeData(req.body);
    }

    // Sanitize query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      if (!validateInputLength(req.query)) {
        throw createError('Query parameters too large', 413);
      }
      req.query = sanitizeData(req.query);
    }

    // Sanitize URL parameters
    if (req.params && Object.keys(req.params).length > 0) {
      if (!validateInputLength(req.params)) {
        throw createError('URL parameters too large', 413);
      }
      req.params = sanitizeData(req.params);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Strict sanitization for sensitive endpoints.
 *
 * More aggressive sanitization for endpoints that handle
 * user-generated content or sensitive data.
 */
export const strictSanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Apply regular sanitization
    sanitizeInput(req, res, () => {
      // Additional strict sanitization
      if (req.body && typeof req.body === 'object') {
        // Remove any remaining potentially dangerous properties
        const dangerousProps = ['__proto__', 'constructor', 'prototype'];
        dangerousProps.forEach(prop => {
          if (Object.prototype.hasOwnProperty.call(req.body, prop)) {
            delete req.body[prop];
          }
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Content-Type validation middleware.
 *
 * Ensures that requests with JSON content type actually contain valid JSON.
 */
export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const contentType = req.headers['content-type'];

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (contentType && contentType.includes('application/json')) {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(
          createError('Request body is required for JSON requests', 400)
        );
      }
    }
  }

  next();
};
