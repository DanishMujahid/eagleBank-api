import { Router } from 'express';
import {
  createAccount,
  getAccountById,
  getUserAccounts,
  updateAccount,
  deleteAccount,
} from '../controllers/accountController';
import { validateRequest, accountCreateSchema } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All account routes require authentication
router.use(authenticateToken);

// POST /v1/accounts - Create a new bank account
router.post('/', validateRequest(accountCreateSchema), createAccount);

// GET /v1/accounts - Get all accounts for the authenticated user
router.get('/', getUserAccounts);

// GET /v1/accounts/:accountId - Get a specific account
router.get('/:accountId', getAccountById);

// PATCH /v1/accounts/:accountId - Update account details
router.patch('/:accountId', updateAccount);

// DELETE /v1/accounts/:accountId - Delete an account
router.delete('/:accountId', deleteAccount);

export default router;
