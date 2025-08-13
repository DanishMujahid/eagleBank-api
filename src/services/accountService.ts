import { prisma } from '../db/client';
import { createError } from '../middleware/errorHandler';

export class AccountService {
  /**
   * Create a new bank account for a user
   * @param accountData Account creation data
   * @param userId ID of the user creating the account
   * @returns Account object
   * @throws Error with statusCode if account creation fails
   */
  static async createAccount(
    accountData: {
      accountNumber: string;
      currency: string;
      type: string;
    },
    userId: string
  ) {
    try {
      // Check if account number already exists
      const existingAccount = await prisma.account.findUnique({
        where: { accountNumber: accountData.accountNumber },
      });

      if (existingAccount) {
        throw createError('Account number already exists', 409);
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Create the account
      const account = await prisma.account.create({
        data: {
          ...accountData,
          userId,
          balance: 0, // Start with zero balance
          status: 'ACTIVE', // Default status
        },
      });

      return account;
    } catch (error) {
      // Rethrow known errors with statusCode
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }

      // Wrap unknown errors in 500 error
      throw createError('Failed to create account', 500);
    }
  }

  /**
   * Get account by ID (with user ownership validation)
   * @param accountId Account ID to retrieve
   * @param userId ID of the requesting user
   * @returns Account object or null if not found
   * @throws Error with statusCode if access is forbidden
   */
  static async getAccountById(accountId: string, userId: string) {
    try {
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!account) {
        return null;
      }

      // Check if user owns this account
      if (account.userId !== userId) {
        throw createError(
          'Forbidden: You can only access your own accounts',
          403
        );
      }

      return account;
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to retrieve account', 500);
    }
  }

  /**
   * Get all accounts for a user
   * @param userId ID of the user
   * @returns Array of account objects
   */
  static async getAccountsByUserId(userId: string) {
    try {
      const accounts = await prisma.account.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return accounts;
    } catch (error) {
      throw createError('Failed to retrieve accounts', 500);
    }
  }

  /**
   * Update account information
   * @param accountId Account ID to update
   * @param userId ID of the requesting user
   * @param updateData Data to update
   * @returns Updated account object
   */
  static async updateAccount(
    accountId: string,
    userId: string,
    updateData: Partial<{
      currency: string;
      type: string;
      status: string;
    }>
  ) {
    try {
      // Check if account exists and user owns it
      const existingAccount = await this.getAccountById(accountId, userId);
      if (!existingAccount) {
        throw createError('Account not found', 404);
      }

      // Update the account
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: updateData,
      });

      return updatedAccount;
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to update account', 500);
    }
  }

  /**
   * Delete account by ID
   * @param accountId Account ID to delete
   * @param userId ID of the requesting user
   */
  static async deleteAccount(accountId: string, userId: string) {
    try {
      // Check if account exists and user owns it
      const existingAccount = await this.getAccountById(accountId, userId);
      if (!existingAccount) {
        throw createError('Account not found', 404);
      }

      // Check if account has transactions
      const transactionCount = await prisma.transaction.count({
        where: { accountId },
      });

      if (transactionCount > 0) {
        throw createError(
          'Cannot delete account with existing transactions',
          409
        );
      }

      // Delete the account
      await prisma.account.delete({
        where: { id: accountId },
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to delete account', 500);
    }
  }
}
