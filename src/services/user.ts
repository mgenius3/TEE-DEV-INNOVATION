import { UserModel, UserResponse, UserUpdateData } from '../models/User';

export class UserService {
  static async getUserProfile(userId: number): Promise<UserResponse> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  }

  static async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return null;
    }
    
    // Return user without password
    return await UserModel.findById(user.id!);
  }

  static async updateUserProfile(userId: number, updateData: UserUpdateData): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new Error('USER_NOT_FOUND');
    }

    // If email is being updated, check if new email already exists
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await UserModel.findByEmail(updateData.email);
      if (emailExists) {
        throw new Error('EMAIL_ALREADY_EXISTS');
      }
    }

    // Update user
    const updatedUser = await UserModel.update(userId, updateData);
    if (!updatedUser) {
      throw new Error('UPDATE_FAILED');
    }

    return updatedUser;
  }

  static async deleteUser(userId: number): Promise<void> {
    // Check if user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new Error('USER_NOT_FOUND');
    }

    const deleted = await UserModel.delete(userId);
    if (!deleted) {
      throw new Error('DELETE_FAILED');
    }
  }
}