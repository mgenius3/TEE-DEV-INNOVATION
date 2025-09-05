"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserModel {
    static async create(userData) {
        const connection = (0, database_1.getConnection)();
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, saltRounds);
        const [result] = await connection.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [userData.email, hashedPassword, userData.name]);
        const insertResult = result;
        const userId = insertResult.insertId;
        const user = await this.findById(userId);
        if (!user) {
            throw new Error('Failed to create user');
        }
        return user;
    }
    static async findByEmail(email) {
        const connection = (0, database_1.getConnection)();
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        const users = rows;
        return users.length > 0 ? users[0] : null;
    }
    static async findById(id) {
        const connection = (0, database_1.getConnection)();
        const [rows] = await connection.execute('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?', [id]);
        const users = rows;
        return users.length > 0 ? users[0] : null;
    }
    static async update(id, updateData) {
        const connection = (0, database_1.getConnection)();
        const updateFields = [];
        const updateValues = [];
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
            const hashedPassword = await bcryptjs_1.default.hash(updateData.password, saltRounds);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }
        if (updateFields.length === 0) {
            return this.findById(id);
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        const [result] = await connection.execute(query, updateValues);
        const updateResult = result;
        if (updateResult.affectedRows === 0) {
            return null;
        }
        return this.findById(id);
    }
    static async validatePassword(plainPassword, hashedPassword) {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    }
    static async delete(id) {
        const connection = (0, database_1.getConnection)();
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        const deleteResult = result;
        return deleteResult.affectedRows > 0;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map