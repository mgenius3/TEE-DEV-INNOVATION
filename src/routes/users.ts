import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { UserController } from '../controllers/user';

const router = express.Router();

// Get current user profile (JWT protected)
router.get('/me', authenticateToken, UserController.getProfile);

// Update current user profile (JWT protected)
router.put('/me', [
  authenticateToken,
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], UserController.updateProfile);

// Delete current user profile (JWT protected)
router.delete('/me', authenticateToken, UserController.deleteProfile);

export { router as userRoutes };