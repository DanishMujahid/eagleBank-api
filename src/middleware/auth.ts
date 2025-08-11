import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthenticatedRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    // Token is invalid, expired, or malformed
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
