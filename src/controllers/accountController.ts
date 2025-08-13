import { Request, Response, NextFunction } from 'express';
import { AccountService } from '../services/accountService';

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accountData = req.body;
    const authenticatedUserId = (req as any).user.userId;

    const account = await AccountService.createAccount(
      accountData,
      authenticatedUserId
    );

    res.status(201).json({
      success: true,
      data: account,
      message: 'Account created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const authenticatedUserId = (req as any).user.userId;

    if (!accountId) {
      res.status(400).json({
        success: false,
        error: 'Account ID is required',
      });
      return;
    }

    const account = await AccountService.getAccountById(
      accountId,
      authenticatedUserId
    );

    if (!account) {
      res.status(404).json({
        success: false,
        error: 'Account not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: account,
      message: 'Account retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUserId = (req as any).user.userId;

    const accounts =
      await AccountService.getAccountsByUserId(authenticatedUserId);

    res.status(200).json({
      success: true,
      data: accounts,
      message: 'Accounts retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const authenticatedUserId = (req as any).user.userId;
    const updateData = req.body;

    if (!accountId) {
      res.status(400).json({
        success: false,
        error: 'Account ID is required',
      });
      return;
    }

    const updatedAccount = await AccountService.updateAccount(
      accountId,
      authenticatedUserId,
      updateData
    );

    res.status(200).json({
      success: true,
      data: updatedAccount,
      message: 'Account updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const authenticatedUserId = (req as any).user.userId;

    if (!accountId) {
      res.status(400).json({
        success: false,
        error: 'Account ID is required',
      });
      return;
    }

    await AccountService.deleteAccount(accountId, authenticatedUserId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
