import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { generateToken } from '../middleware/auth';

interface LoginRequestBody {
  email: string;
  password: string;
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequestBody;

    // Authenticate user
    const user = await UserService.authenticateUser({ email, password });

    // Generate JWT token payload
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    // Forward error to global error handler
    next(error);
  }
};
