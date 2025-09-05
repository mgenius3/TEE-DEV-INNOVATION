"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../services/user");
class UserController {
    static async getProfile(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const user = await user_1.UserService.getUserProfile(req.user.userId);
            res.json({
                message: 'User profile retrieved successfully',
                user
            });
        }
        catch (error) {
            if (error.message === 'USER_NOT_FOUND') {
                return res.status(404).json({ error: 'User not found' });
            }
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
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
            const updateData = {};
            if (name)
                updateData.name = name;
            if (email)
                updateData.email = email;
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'At least one field (name or email) must be provided' });
            }
            const user = await user_1.UserService.updateUserProfile(req.user.userId, updateData);
            res.json({
                message: 'User profile updated successfully',
                user
            });
        }
        catch (error) {
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
    static async deleteProfile(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            await user_1.UserService.deleteUser(req.user.userId);
            res.json({
                message: 'User account deleted successfully'
            });
        }
        catch (error) {
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
exports.UserController = UserController;
//# sourceMappingURL=user.js.map