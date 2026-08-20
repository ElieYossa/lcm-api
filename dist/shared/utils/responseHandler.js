"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        error: error ? (process.env.NODE_ENV === 'development' ? error : 'An error occurred') : null,
        timestamp: new Date().toISOString()
    });
};
exports.sendResponse = sendResponse;
