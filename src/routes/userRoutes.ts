import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { validateRequest, userCreateSchema } from '../middleware/validation';

const router = Router();

// POST /v1/users - Create a new user (no auth required)
router.post('/', validateRequest(userCreateSchema), createUser);

export default router;
