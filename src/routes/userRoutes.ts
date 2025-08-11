import { Request, Response, NextFunction, Router } from 'express';
import { z } from 'zod';
import { createUser } from '../controllers/userController';
import { userCreateSchema } from '../middleware/validation';

export const validateRequest =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    schema
      .parseAsync(req.body)
      .then(() => next())
      .catch(err => {
        res.status(400).json({ success: false, error: err.errors });
      });
  };

const router = Router();

// POST /v1/users - Create a new user (no auth required)
router.post('/', validateRequest(userCreateSchema), createUser);

export default router;
