"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            error: 'Email already exists'
        });
    }
    res.status(500).json({
        error: 'Internal server error'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map