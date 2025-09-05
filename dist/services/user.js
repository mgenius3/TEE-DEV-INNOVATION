"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
class UserService {
    static async getUserProfile(userId) {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return user;
    }
    static async getUserByEmail(email) {
        const user = await User_1.UserModel.findByEmail(email);
        if (!user) {
            return null;
        }
        return await User_1.UserModel.findById(user.id);
    }
    static async updateUserProfile(userId, updateData) {
        const existingUser = await User_1.UserModel.findById(userId);
        if (!existingUser) {
            throw new Error('USER_NOT_FOUND');
        }
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await User_1.UserModel.findByEmail(updateData.email);
            if (emailExists) {
                throw new Error('EMAIL_ALREADY_EXISTS');
            }
        }
        const updatedUser = await User_1.UserModel.update(userId, updateData);
        if (!updatedUser) {
            throw new Error('UPDATE_FAILED');
        }
        return updatedUser;
    }
    static async deleteUser(userId) {
        const existingUser = await User_1.UserModel.findById(userId);
        if (!existingUser) {
            throw new Error('USER_NOT_FOUND');
        }
        const deleted = await User_1.UserModel.delete(userId);
        if (!deleted) {
            throw new Error('DELETE_FAILED');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.js.map