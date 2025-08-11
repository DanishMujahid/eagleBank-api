import { Router } from 'express';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import {
  validateRequest,
  userCreateSchema,
  userUpdateSchema,
} from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /v1/users - Create a new user (no auth required)
router.post('/', validateRequest(userCreateSchema), createUser);

// Protected routes - require authentication
router.get('/:userId', authenticateToken, getUserById);
router.patch(
  '/:userId',
  authenticateToken,
  validateRequest(userUpdateSchema),
  updateUser
);
router.delete('/:userId', authenticateToken, deleteUser);

export default router;
