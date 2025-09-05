"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const auth_1 = require("../services/auth");
class AuthController {
    static async register(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }
            const { email, password, name } = req.body;
            const result = await auth_1.AuthService.registerUser({ email, password, name });
            res.status(201).json({
                message: 'User registered successfully',
                user: result.user,
                token: result.token
            });
        }
        catch (error) {
            if (error.message === 'EMAIL_ALREADY_EXISTS') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }
            const { email, password } = req.body;
            const result = await auth_1.AuthService.loginUser({ email, password });
            res.json({
                message: 'Login successful',
                user: result.user,
                token: result.token
            });
        }
        catch (error) {
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
exports.AuthController = AuthController;
//# sourceMappingURL=auth.js.map