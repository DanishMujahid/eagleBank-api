import { prisma } from '../db/client';
import { createError } from '../middleware/errorHandler';

interface CustomError extends Error {
  statusCode?: number;
}

export class TransactionService {
  static async createTransaction(
    accountId: string,
    userId: string,
    transactionData: {
      type: 'DEPOSIT' | 'WITHDRAWAL';
      amount: number;
      description?: string;
    }
  ) {
    try {
      // Verify account exists and belongs to user
      const account = await prisma.account.findFirst({
        where: {
          id: accountId,
          userId: userId,
        },
      });

      if (!account) {
        throw createError('Account not found', 404);
      }

      if (account.status !== 'ACTIVE') {
        throw createError(
          'Cannot perform transactions on inactive account',
          400
        );
      }

      // Validate amount
      if (transactionData.amount <= 0) {
        throw createError('Transaction amount must be positive', 400);
      }

      // Check sufficient funds for withdrawal
      if (
        transactionData.type === 'WITHDRAWAL' &&
        account.balance < transactionData.amount
      ) {
        throw createError('Insufficient funds', 400);
      }

      // Calculate new balance
      const newBalance =
        transactionData.type === 'DEPOSIT'
          ? account.balance + transactionData.amount
          : account.balance - transactionData.amount;

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx: any) => {
        // Create transaction record
        const transaction = await tx.transaction.create({
          data: {
            type: transactionData.type,
            amount: transactionData.amount,
            description:
              transactionData.description ||
              `${transactionData.type} transaction`,
            accountId: accountId,
            balanceBefore: account.balance,
            balanceAfter: newBalance,
          },
        });

        // Update account balance
        const updatedAccount = await tx.account.update({
          where: { id: accountId },
          data: { balance: newBalance },
        });

        return { transaction, account: updatedAccount };
      });

      return result.transaction;
    } catch (error) {
      if ((error as CustomError).statusCode) {
        throw error;
      }
      throw createError('Failed to create transaction', 500);
    }
  }

  static async getTransactionById(
    transactionId: string,
    accountId: string,
    userId: string
  ) {
    try {
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
          account: {
            id: accountId,
            userId: userId,
          },
        },
        include: {
          account: {
            select: {
              id: true,
              accountNumber: true,
              type: true,
              currency: true,
            },
          },
        },
      });

      if (!transaction) {
        throw createError('Transaction not found', 404);
      }

      return transaction;
    } catch (error) {
      if ((error as CustomError).statusCode) {
        throw error;
      }
      throw createError('Failed to retrieve transaction', 500);
    }
  }

  static async getTransactionsByAccountId(
    accountId: string,
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      type?: 'DEPOSIT' | 'WITHDRAWAL';
    }
  ) {
    try {
      // Verify account exists and belongs to user
      const account = await prisma.account.findFirst({
        where: {
          id: accountId,
          userId: userId,
        },
      });

      if (!account) {
        throw createError('Account not found', 404);
      }

      const page = options?.page || 1;
      const limit = options?.limit || 50;
      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {
        accountId: accountId,
      };

      if (options?.type) {
        whereClause.type = options.type;
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            account: {
              select: {
                id: true,
                accountNumber: true,
                type: true,
                currency: true,
              },
            },
          },
        }),
        prisma.transaction.count({ where: whereClause }),
      ]);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if ((error as CustomError).statusCode) {
        throw error;
      }
      throw createError('Failed to retrieve transactions', 500);
    }
  }

  static async getTransactionHistory(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      accountId?: string;
      type?: 'DEPOSIT' | 'WITHDRAWAL';
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 50;
      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {
        account: {
          userId: userId,
        },
      };

      if (options?.accountId) {
        whereClause.accountId = options.accountId;
      }

      if (options?.type) {
        whereClause.type = options.type;
      }

      if (options?.startDate || options?.endDate) {
        whereClause.createdAt = {};
        if (options?.startDate) {
          whereClause.createdAt.gte = options.startDate;
        }
        if (options?.endDate) {
          whereClause.createdAt.lte = options.endDate;
        }
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            account: {
              select: {
                id: true,
                accountNumber: true,
                type: true,
                currency: true,
              },
            },
          },
        }),
        prisma.transaction.count({ where: whereClause }),
      ]);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if ((error as CustomError).statusCode) {
        throw error;
      }
      throw createError('Failed to retrieve transaction history', 500);
    }
  }
}
