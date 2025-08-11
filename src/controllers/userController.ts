import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

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
    // Forward error to global error handler
    next(error);
  }
};
