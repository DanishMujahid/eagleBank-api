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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = (req as any).user.userId;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    // Check if user is accessing their own data
    if (userId !== authenticatedUserId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: You can only access your own user data',
      });
      return;
    }

    const user = await UserService.getUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = (req as any).user.userId;
    const updateData = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    // Check if user is updating their own data
    if (userId !== authenticatedUserId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: You can only update your own user data',
      });
      return;
    }

    const updatedUser = await UserService.updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = (req as any).user.userId;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    // Check if user is deleting their own data
    if (userId !== authenticatedUserId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: You can only delete your own user data',
      });
      return;
    }

    await UserService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
