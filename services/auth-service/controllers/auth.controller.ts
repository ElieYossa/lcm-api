import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../../../shared/utils/responseHandler';

export const register = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.registerUser(req.body);
        return sendResponse(res, 201, true, "Utilisateur créé avec succès", result);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message || "Erreur lors de l'inscription", null, error);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginUser(req.body);
        return sendResponse(res, 200, true, "Connexion réussie", result);
    } catch (error: any) {
        return sendResponse(res, 401, false, error.message || "Identifiants invalides", null, error);
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; 
        const user = await AuthService.getUserById(userId);
        
        return sendResponse(res, 200, true, "Profil récupéré", user);
    } catch (error: any) {
        return sendResponse(res, 404, false, error.message, null, error);
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const updatedUser = await AuthService.updateUserProfile(userId, req.body);
        
        return sendResponse(res, 200, true, "Profil mis à jour avec succès", updatedUser);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message, null, error);
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw new Error("Refresh Token requis");
        
        await AuthService.logout(refreshToken);
        return sendResponse(res, 200, true, "Déconnexion réussie");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message, null, error);
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw new Error("Refresh Token requis");

        const result = await AuthService.refreshAccessToken(refreshToken);
        return sendResponse(res, 200, true, "Token rafraîchi avec succès", result);
    } catch (error: any) {
        return sendResponse(res, 401, false, error.message, null, error);
    }
};