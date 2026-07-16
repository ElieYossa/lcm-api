import { Response } from 'express';

export const sendResponse = (
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data: any = null,
    error: any = null
) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        error: error ? (process.env.NODE_ENV === 'development' ? error : 'An error occurred') : null,
        timestamp: new Date().toISOString()
    });
};