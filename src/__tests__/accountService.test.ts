import { AccountService } from '../services/accountService';
import { prisma } from '../db/client';
import { createError } from '../middleware/errorHandler';

// Mock Prisma client
jest.mock('../db/client', () => ({
  prisma: {
    account: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    transaction: {
      count: jest.fn(),
    },
  },
}));

// Mock error handler
jest.mock('../middleware/errorHandler', () => ({
  createError: jest.fn((message: string, statusCode: number) => {
    const error = new Error(message) as any;
    error.statusCode = statusCode;
    return error;
  }),
}));

describe('AccountService', () => {
  const mockUserId = 'user-123';
  const mockAccountId = 'account-123';
  const mockAccountData = {
    accountNumber: '12345678',
    currency: 'GBP',
    type: 'CHECKING',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create an account successfully', async () => {
      const mockUser = { id: mockUserId, email: 'test@example.com' };
      const mockAccount = {
        id: mockAccountId,
        ...mockAccountData,
        balance: 0,
        status: 'ACTIVE',
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.account.create as jest.Mock).mockResolvedValue(mockAccount);

      const result = await AccountService.createAccount(
        mockAccountData,
        mockUserId
      );

      expect(result).toEqual(mockAccount);
      expect(prisma.account.create).toHaveBeenCalledWith({
        data: {
          ...mockAccountData,
          userId: mockUserId,
          balance: 0,
          status: 'ACTIVE',
        },
      });
    });

    it('should throw error if account number already exists', async () => {
      const existingAccount = { id: 'existing-account' };
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(
        existingAccount
      );

      await expect(
        AccountService.createAccount(mockAccountData, mockUserId)
      ).rejects.toThrow('Account number already exists');

      expect(createError).toHaveBeenCalledWith(
        'Account number already exists',
        409
      );
    });

    it('should throw error if user not found', async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        AccountService.createAccount(mockAccountData, mockUserId)
      ).rejects.toThrow('User not found');

      expect(createError).toHaveBeenCalledWith('User not found', 404);
    });
  });

  describe('getAccountById', () => {
    it('should return account if user owns it', async () => {
      const mockAccount = {
        id: mockAccountId,
        userId: mockUserId,
        ...mockAccountData,
        balance: 100,
        status: 'ACTIVE',
        user: {
          id: mockUserId,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      const result = await AccountService.getAccountById(
        mockAccountId,
        mockUserId
      );

      expect(result).toEqual(mockAccount);
    });

    it('should throw error if user does not own account', async () => {
      const mockAccount = {
        id: mockAccountId,
        userId: 'different-user',
        ...mockAccountData,
      };

      (prisma.account.findUnique as jest.Mock).mockResolvedValue(mockAccount);

      await expect(
        AccountService.getAccountById(mockAccountId, mockUserId)
      ).rejects.toThrow('Forbidden: You can only access your own accounts');

      expect(createError).toHaveBeenCalledWith(
        'Forbidden: You can only access your own accounts',
        403
      );
    });

    it('should return null if account not found', async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await AccountService.getAccountById(
        mockAccountId,
        mockUserId
      );

      expect(result).toBeNull();
    });
  });

  describe('getAccountsByUserId', () => {
    it('should return all accounts for user', async () => {
      const mockAccounts = [
        { id: 'acc1', userId: mockUserId, accountNumber: '123' },
        { id: 'acc2', userId: mockUserId, accountNumber: '456' },
      ];

      (prisma.account.findMany as jest.Mock).mockResolvedValue(mockAccounts);

      const result = await AccountService.getAccountsByUserId(mockUserId);

      expect(result).toEqual(mockAccounts);
      expect(prisma.account.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateAccount', () => {
    it('should update account successfully', async () => {
      const mockAccount = {
        id: mockAccountId,
        userId: mockUserId,
        ...mockAccountData,
      };
      const updateData = { status: 'SUSPENDED' };
      const updatedAccount = { ...mockAccount, ...updateData };

      // Mock getAccountById to return existing account
      jest
        .spyOn(AccountService, 'getAccountById')
        .mockResolvedValue(mockAccount as any);
      (prisma.account.update as jest.Mock).mockResolvedValue(updatedAccount);

      const result = await AccountService.updateAccount(
        mockAccountId,
        mockUserId,
        updateData
      );

      expect(result).toEqual(updatedAccount);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: mockAccountId },
        data: updateData,
      });
    });

    it('should throw error if account not found', async () => {
      jest.spyOn(AccountService, 'getAccountById').mockResolvedValue(null);

      await expect(
        AccountService.updateAccount(mockAccountId, mockUserId, {
          status: 'SUSPENDED',
        })
      ).rejects.toThrow('Account not found');

      expect(createError).toHaveBeenCalledWith('Account not found', 404);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const mockAccount = {
        id: mockAccountId,
        userId: mockUserId,
        ...mockAccountData,
      };

      jest
        .spyOn(AccountService, 'getAccountById')
        .mockResolvedValue(mockAccount as any);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(0);
      (prisma.account.delete as jest.Mock).mockResolvedValue(undefined);

      await AccountService.deleteAccount(mockAccountId, mockUserId);

      expect(prisma.account.delete).toHaveBeenCalledWith({
        where: { id: mockAccountId },
      });
    });

    it('should throw error if account has transactions', async () => {
      const mockAccount = {
        id: mockAccountId,
        userId: mockUserId,
        ...mockAccountData,
      };

      jest
        .spyOn(AccountService, 'getAccountById')
        .mockResolvedValue(mockAccount as any);
      (prisma.transaction.count as jest.Mock).mockResolvedValue(5);

      await expect(
        AccountService.deleteAccount(mockAccountId, mockUserId)
      ).rejects.toThrow('Cannot delete account with existing transactions');

      expect(createError).toHaveBeenCalledWith(
        'Cannot delete account with existing transactions',
        409
      );
    });
  });
});
