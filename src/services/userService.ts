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

  /**
   * Get user by ID (without password)
   * @param userId User ID to retrieve
   * @returns User object without password field or null if not found
   */
  static async getUserById(
    userId: string
  ): Promise<Omit<import('@prisma/client').User, 'password'> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return null;
      }

      // Return user without password
      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw createError('Failed to retrieve user', 500);
    }
  }

  /**
   * Update user information
   * @param userId User ID to update
   * @param updateData Data to update (firstName, lastName, email)
   * @returns Updated user object without password field
   */
  static async updateUser(
    userId: string,
    updateData: Partial<
      Pick<import('@prisma/client').User, 'firstName' | 'lastName' | 'email'>
    >
  ): Promise<Omit<import('@prisma/client').User, 'password'>> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw createError('User not found', 404);
      }

      // If email is being updated, check for uniqueness
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: updateData.email },
        });

        if (emailExists) {
          throw createError('Email already in use', 409);
        }
      }

      // Update the user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      // Return user without password
      // eslint-disable-next-line no-unused-vars
      const { password: _password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to update user', 500);
    }
  }

  /**
   * Delete user by ID
   * @param userId User ID to delete
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: true,
        },
      });

      if (!existingUser) {
        throw createError('User not found', 404);
      }

      // Check if user has accounts
      if (existingUser.accounts.length > 0) {
        throw createError(
          'Cannot delete user with existing bank accounts',
          409
        );
      }

      // Delete the user
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to delete user', 500);
    }
  }
}
