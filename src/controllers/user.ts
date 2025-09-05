import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import { UserService } from '../services/user';

export class UserController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get user profile through service
      const user = await UserService.getUserProfile(req.user.userId);

      res.json({
        message: 'User profile retrieved successfully',
        user
      });
    } catch (error: any) {
      // Handle specific service errors
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { name, email } = req.body;
      const updateData: { name?: string; email?: string } = {};
      
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      // Validate that at least one field is provided
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'At least one field (name or email) must be provided' });
      }

      // Update user profile through service
      const user = await UserService.updateUserProfile(req.user.userId, updateData);

      res.json({
        message: 'User profile updated successfully',
        user
      });
    } catch (error: any) {
      // Handle specific service errors
      if (error.message === 'USER_NOT_FOUND') { 
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(400).json({ error: 'Email already exists' });
      }

      if (error.message === 'UPDATE_FAILED') {
        return res.status(500).json({ error: 'Failed to update user profile' });
      }
      
      next(error);
    }
  }

  static async deleteProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Delete user through service
      await UserService.deleteUser(req.user.userId);

      res.json({
        message: 'User account deleted successfully'
      });
    } catch (error: any) {
      // Handle specific service errors
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }

      if (error.message === 'DELETE_FAILED') {
        return res.status(500).json({ error: 'Failed to delete user account' });
      }
      
      next(error);
    }
  }
}