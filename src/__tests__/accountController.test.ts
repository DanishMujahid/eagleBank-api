import { Request, Response, NextFunction } from 'express';
import {
  createAccount,
  getAccountById,
  getUserAccounts,
  updateAccount,
  deleteAccount,
} from '../controllers/accountController';
import { AccountService } from '../services/accountService';

// Mock AccountService
jest.mock('../services/accountService');

describe('AccountController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      user: { userId: 'user-123' },
    } as any;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create account successfully', async () => {
      const mockAccount = {
        id: 'account-123',
        accountNumber: '12345678',
        currency: 'GBP',
        type: 'CHECKING',
        balance: 0,
        status: 'ACTIVE',
        userId: 'user-123',
      };

      (AccountService.createAccount as jest.Mock).mockResolvedValue(
        mockAccount
      );

      await createAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(AccountService.createAccount).toHaveBeenCalledWith(
        mockRequest.body,
        'user-123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockAccount,
        message: 'Account created successfully',
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Service error');
      (AccountService.createAccount as jest.Mock).mockRejectedValue(error);

      await createAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAccountById', () => {
    it('should return account successfully', async () => {
      const mockAccount = {
        id: 'account-123',
        accountNumber: '12345678',
        currency: 'GBP',
        type: 'CHECKING',
        balance: 100,
        status: 'ACTIVE',
        userId: 'user-123',
      };

      mockRequest.params = { accountId: 'account-123' };
      (AccountService.getAccountById as jest.Mock).mockResolvedValue(
        mockAccount
      );

      await getAccountById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(AccountService.getAccountById).toHaveBeenCalledWith(
        'account-123',
        'user-123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockAccount,
        message: 'Account retrieved successfully',
      });
    });

    it('should return 400 if accountId is missing', async () => {
      mockRequest.params = {};

      await getAccountById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Account ID is required',
      });
    });

    it('should return 404 if account not found', async () => {
      mockRequest.params = { accountId: 'account-123' };
      (AccountService.getAccountById as jest.Mock).mockResolvedValue(null);

      await getAccountById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Account not found',
      });
    });

    it('should call next with error on service failure', async () => {
      const error = new Error('Service error');
      mockRequest.params = { accountId: 'account-123' };
      (AccountService.getAccountById as jest.Mock).mockRejectedValue(error);

      await getAccountById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserAccounts', () => {
    it('should return user accounts successfully', async () => {
      const mockAccounts = [
        { id: 'acc1', accountNumber: '123' },
        { id: 'acc2', accountNumber: '456' },
      ];

      (AccountService.getAccountsByUserId as jest.Mock).mockResolvedValue(
        mockAccounts
      );

      await getUserAccounts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(AccountService.getAccountsByUserId).toHaveBeenCalledWith(
        'user-123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockAccounts,
        message: 'Accounts retrieved successfully',
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Service error');
      (AccountService.getAccountsByUserId as jest.Mock).mockRejectedValue(
        error
      );

      await getUserAccounts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateAccount', () => {
    it('should update account successfully', async () => {
      const updateData = { status: 'SUSPENDED' };
      const updatedAccount = {
        id: 'account-123',
        status: 'SUSPENDED',
        accountNumber: '12345678',
      };

      mockRequest.params = { accountId: 'account-123' };
      mockRequest.body = updateData;
      (AccountService.updateAccount as jest.Mock).mockResolvedValue(
        updatedAccount
      );

      await updateAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(AccountService.updateAccount).toHaveBeenCalledWith(
        'account-123',
        'user-123',
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedAccount,
        message: 'Account updated successfully',
      });
    });

    it('should return 400 if accountId is missing', async () => {
      mockRequest.params = {};

      await updateAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Account ID is required',
      });
    });

    it('should call next with error on service failure', async () => {
      const error = new Error('Service error');
      mockRequest.params = { accountId: 'account-123' };
      (AccountService.updateAccount as jest.Mock).mockRejectedValue(error);

      await updateAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      mockRequest.params = { accountId: 'account-123' };
      (AccountService.deleteAccount as jest.Mock).mockResolvedValue(undefined);

      await deleteAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(AccountService.deleteAccount).toHaveBeenCalledWith(
        'account-123',
        'user-123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Account deleted successfully',
      });
    });

    it('should return 400 if accountId is missing', async () => {
      mockRequest.params = {};

      await deleteAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Account ID is required',
      });
    });

    it('should call next with error on service failure', async () => {
      const error = new Error('Service error');
      mockRequest.params = { accountId: 'account-123' };
      (AccountService.deleteAccount as jest.Mock).mockRejectedValue(error);

      await deleteAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
