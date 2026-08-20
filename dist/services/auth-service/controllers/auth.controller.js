"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.logout = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const responseHandler_1 = require("../../../shared/utils/responseHandler");
const register = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.registerUser(req.body);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Utilisateur créé avec succès", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message || "Erreur lors de l'inscription", null, error);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.loginUser(req.body);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Connexion réussie", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 401, false, error.message || "Identifiants invalides", null, error);
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await auth_service_1.AuthService.getUserById(userId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Profil récupéré", user);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 404, false, error.message, null, error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedUser = await auth_service_1.AuthService.updateUserProfile(userId, req.body);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Profil mis à jour avec succès", updatedUser);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message, null, error);
    }
};
exports.updateProfile = updateProfile;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw new Error("Refresh Token requis");
        await auth_service_1.AuthService.logout(refreshToken);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Déconnexion réussie");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message, null, error);
    }
};
exports.logout = logout;
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw new Error("Refresh Token requis");
        const result = await auth_service_1.AuthService.refreshAccessToken(refreshToken);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Token rafraîchi avec succès", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 401, false, error.message, null, error);
    }
};
exports.refresh = refresh;
