"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async registerUser(userData) {
        const existingUser = await User_1.UserModel.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
        const newUser = await User_1.UserModel.create(userData);
        const token = (0, jwt_1.generateToken)({
            userId: newUser.id,
            email: newUser.email
        });
        return {
            user: newUser,
            token
        };
    }
    static async loginUser(loginData) {
        const user = await User_1.UserModel.findByEmail(loginData.email);
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }
        const isValidPassword = await User_1.UserModel.validatePassword(loginData.password, user.password);
        if (!isValidPassword) {
            throw new Error('INVALID_CREDENTIALS');
        }
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email
        });
        const userResponse = await User_1.UserModel.findById(user.id);
        if (!userResponse) {
            throw new Error('USER_NOT_FOUND');
        }
        return {
            user: userResponse,
            token
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.js.map