import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transactionService';

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const { type, amount, description } = req.body;
    const authenticatedUserId = (req as any).user.userId;

    if (!accountId) {
      res.status(400).json({
        success: false,
        error: 'Account ID is required',
      });
      return;
    }

    const transaction = await TransactionService.createTransaction(
      accountId,
      authenticatedUserId,
      { type, amount, description }
    );

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId, transactionId } = req.params;
    const authenticatedUserId = (req as any).user.userId;

    if (!accountId || !transactionId) {
      res.status(400).json({
        success: false,
        error: 'Account ID and Transaction ID are required',
      });
      return;
    }

    const transaction = await TransactionService.getTransactionById(
      transactionId,
      accountId,
      authenticatedUserId
    );

    res.status(200).json({
      success: true,
      data: transaction,
      message: 'Transaction retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const authenticatedUserId = (req as any).user.userId;
    const { page, limit, type } = req.query;

    if (!accountId) {
      res.status(400).json({
        success: false,
        error: 'Account ID is required',
      });
      return;
    }

    const options: {
      page?: number;
      limit?: number;
      type?: 'DEPOSIT' | 'WITHDRAWAL';
    } = {};

    if (page) options.page = parseInt(page as string);
    if (limit) options.limit = parseInt(limit as string);
    if (type) options.type = type as 'DEPOSIT' | 'WITHDRAWAL';

    const result = await TransactionService.getTransactionsByAccountId(
      accountId,
      authenticatedUserId,
      options
    );

    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: result.pagination,
      message: 'Transactions retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUserId = (req as any).user.userId;
    const { page, limit, accountId, type, startDate, endDate } = req.query;

    const options: {
      page?: number;
      limit?: number;
      accountId?: string;
      type?: 'DEPOSIT' | 'WITHDRAWAL';
      startDate?: Date;
      endDate?: Date;
    } = {};

    if (page) options.page = parseInt(page as string);
    if (limit) options.limit = parseInt(limit as string);
    if (accountId) options.accountId = accountId as string;
    if (type) options.type = type as 'DEPOSIT' | 'WITHDRAWAL';
    if (startDate) options.startDate = new Date(startDate as string);
    if (endDate) options.endDate = new Date(endDate as string);

    const result = await TransactionService.getTransactionHistory(
      authenticatedUserId,
      options
    );

    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: result.pagination,
      message: 'Transaction history retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
