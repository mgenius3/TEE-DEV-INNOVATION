"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
exports.userRoutes = router;
router.get('/me', auth_1.authenticateToken, user_1.UserController.getProfile);
router.put('/me', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Valid email is required')
], user_1.UserController.updateProfile);
router.delete('/me', auth_1.authenticateToken, user_1.UserController.deleteProfile);
//# sourceMappingURL=users.js.map