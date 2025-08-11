import { prisma } from '../db/client';
import { hashPassword, comparePassword } from '../utils/password';
import { createError } from '../middleware/errorHandler';
import { UserCreateInput, UserLoginInput } from '../types';

export class UserService {
  /**
   * Create a new user
   * @param userData User creation data including plaintext password
   * @returns User object without password field
   * @throws Error with statusCode if user exists or on failure
   */
  static async createUser(
    userData: UserCreateInput
  ): Promise<Omit<import('@prisma/client').User, 'password'>> {
    try {
      // Check if user already exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw createError('User with this email already exists', 409);
      }

      // Hash the password securely
      const hashedPassword = await hashPassword(userData.password);

      // Create the user record with hashed password
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      // Exclude password from returned user object
      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      // Rethrow known errors with statusCode
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }

      // Wrap unknown errors in generic 500 error
      throw createError('Failed to create user', 500);
    }
  }

  /**
   * Authenticate user login
   * @param loginData User login credentials
   * @returns User object without password field
   * @throws Error with statusCode if authentication fails
   */
  static async authenticateUser(
    loginData: UserLoginInput
  ): Promise<Omit<import('@prisma/client').User, 'password'>> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        throw createError('Invalid email or password', 401);
      }

      // Compare passwords
      const isPasswordValid = await comparePassword(
        loginData.password,
        user.password
      );

      if (!isPasswordValid) {
        throw createError('Invalid email or password', 401);
      }

      // Return user without password
      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      // Rethrow known errors with statusCode
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Authentication failed', 500);
    }
  }
}
