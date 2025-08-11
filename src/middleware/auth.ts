import { Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { JwtPayload, AuthenticatedRequest } from '../types';
import { getEnvConfig } from '../utils/env';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authorization header with Bearer token is required',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const config = getEnvConfig();

  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment configuration');
  }

  try {
    if (typeof token !== 'string') {
      throw new Error('Token is not a string');
    }
    const decoded = jwt.verify(
      token,
      config.JWT_SECRET as Secret
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

export const generateToken = (payload: JwtPayload): string => {
  const config = getEnvConfig();

  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment configuration');
  }

  // Ensure expiresIn is a number or a valid string literal for SignOptions
  let expiresIn: number | undefined = undefined;
  if (config.JWT_EXPIRES_IN) {
    const num = Number(config.JWT_EXPIRES_IN);
    if (!isNaN(num)) {
      expiresIn = num;
    } else {
      // fallback to a default of 24h if not a number
      expiresIn = 24 * 60 * 60; // 24 hours in seconds
    }
  } else {
    expiresIn = 24 * 60 * 60; // 24 hours in seconds
  }
  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, config.JWT_SECRET as Secret, options);
};
