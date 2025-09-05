import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth';

const router = express.Router();

// Registration endpoint
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required')
], AuthController.register);

// Login endpoint
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], AuthController.login);

export { router as authRoutes };