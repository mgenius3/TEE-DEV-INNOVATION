"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10);
const generateToken = (payload) => {
    const options = {
        expiresIn: JWT_EXPIRES_IN
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map