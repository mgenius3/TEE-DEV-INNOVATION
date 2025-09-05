import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password, name } = req.body;

      // Register user through service
      const result = await AuthService.registerUser({ email, password, name });

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      // Handle specific service errors
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Login user through service
      const result = await AuthService.loginUser({ email, password });

      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      // Handle specific service errors
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      next(error);
    }
  }
}