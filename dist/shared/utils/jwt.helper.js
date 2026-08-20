"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret_par_defaut_lcm_2024';
const generateAccessToken = (user) => {
    const signOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, signOptions);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    const signOptions = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d')
    };
    return jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, signOptions);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
