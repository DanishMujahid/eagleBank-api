import { Router } from 'express';
import {
  createTransaction,
  getTransactionById,
  getAccountTransactions,
  getUserTransactionHistory,
} from '../controllers/transactionController';
import {
  validateRequest,
  transactionCreateSchema,
} from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All transaction routes require authentication
router.use(authenticateToken);

// Create transaction for a specific account
router.post(
  '/accounts/:accountId/transactions',
  validateRequest(transactionCreateSchema),
  createTransaction
);

// Get all transactions for a specific account
router.get('/accounts/:accountId/transactions', getAccountTransactions);

// Get a specific transaction by ID
router.get(
  '/accounts/:accountId/transactions/:transactionId',
  getTransactionById
);

// Get user's complete transaction history across all accounts
router.get('/transactions', getUserTransactionHistory);

export default router;
