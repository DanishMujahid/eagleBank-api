import { Router } from 'express';
import { login } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { userLoginSchema } from '../middleware/validation';

const router = Router();

// POST /v1/auth/login - Authenticate user and return JWT token
router.post('/login', validateRequest(userLoginSchema), login);

export default router;
