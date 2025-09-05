import { getConnection } from '../config/database';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
}

export class UserModel {
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<UserResponse> {
    const connection = getConnection();
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const [result] = await connection.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [userData.email, hashedPassword, userData.name]
    );
    
    const insertResult = result as mysql.ResultSetHeader;
    const userId = insertResult.insertId;
    
    // Return the created user (without password)
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }
    
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const connection = getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  static async findById(id: number): Promise<UserResponse | null> {
    const connection = getConnection();
    
    const [rows] = await connection.execute(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    
    const users = rows as UserResponse[];
    return users.length > 0 ? users[0] : null;
  }

  static async update(id: number, updateData: UserUpdateData): Promise<UserResponse | null> {
    const connection = getConnection();
    
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (updateData.name) {
      updateFields.push('name = ?');
      updateValues.push(updateData.name);
    }
    
    if (updateData.email) {
      updateFields.push('email = ?');
      updateValues.push(updateData.email);
    }
    
    if (updateData.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      // No fields to update, return current user
      return this.findById(id);
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);
    
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const [result] = await connection.execute(query, updateValues);
    const updateResult = result as mysql.ResultSetHeader;
    
    if (updateResult.affectedRows === 0) {
      return null; // User not found
    }
    
    // Return the updated user
    return this.findById(id);
  }

  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async delete(id: number): Promise<boolean> {
    const connection = getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    const deleteResult = result as mysql.ResultSetHeader;
    return deleteResult.affectedRows > 0;
  }
}