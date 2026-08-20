"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jwt_helper_1 = require("../utils/jwt.helper");
const responseHandler_1 = require("../utils/responseHandler");
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return (0, responseHandler_1.sendResponse)(res, 401, false, "Accès non autorisé, token manquant");
    }
    try {
        const decoded = (0, jwt_helper_1.verifyToken)(token);
        if (!decoded)
            throw new Error();
        req.user = decoded;
        next();
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 401, false, "Token invalide ou expiré");
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user.role)) {
            return (0, responseHandler_1.sendResponse)(res, 403, false, "Vous n'avez pas la permission d'effectuer cette action");
        }
        next();
    };
};
exports.restrictTo = restrictTo;
