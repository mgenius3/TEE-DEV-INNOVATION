import { UserModel, User, UserResponse } from '../models/User';
import { generateToken } from '../utils/jwt';

export interface RegisterUserData {
  email: string;
  password: string;
  name: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export class AuthService { 
  static async registerUser(userData: RegisterUserData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // Create new user
    const newUser = await UserModel.create(userData);

    // Generate JWT token
    const token = generateToken({ 
      userId: newUser.id,
      email: newUser.email
    });

    return {
      user: newUser,
      token
    };
  }

  static async loginUser(loginData: LoginUserData): Promise<AuthResponse> {
    // Find user by email
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(loginData.password, user.password);
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id!,
      email: user.email
    });

    // Get user without password
    const userResponse = await UserModel.findById(user.id!);
    if (!userResponse) {
      throw new Error('USER_NOT_FOUND');
    }

    return {
      user: userResponse,
      token
    };
  }
}