import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.helper';
import { sendResponse } from '../utils/responseHandler';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return sendResponse(res, 401, false, "Accès non autorisé, token manquant");
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) throw new Error();

        (req as any).user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, 401, false, "Token invalide ou expiré");
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!roles.includes(user.role)) {
            return sendResponse(res, 403, false, "Vous n'avez pas la permission d'effectuer cette action");
        }
        next();
    };
};