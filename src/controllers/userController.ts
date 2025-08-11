import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { createError } from '../middleware/errorHandler';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body;

    const user = await UserService.createUser(userData);

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    // If error has statusCode, forward it
    if (error instanceof Error && 'statusCode' in error) {
      return next(error);
    }
    // Otherwise, wrap it in a 500 internal server error and forward
    return next(createError('Failed to create user', 500));
  }
};
