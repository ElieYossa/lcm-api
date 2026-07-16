import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'secret_par_defaut_lcm_2024';

export const generateAccessToken = (user: any): string => {
    const signOptions: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d'
    };

    return jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        signOptions
    );
};

export const generateRefreshToken = (user: any): string => {
    const signOptions: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as any
    };

    return jwt.sign(
        { id: user.id },
        JWT_SECRET,
        signOptions
    );
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};