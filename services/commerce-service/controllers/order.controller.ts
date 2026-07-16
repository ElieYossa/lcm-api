import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { sendResponse } from '../../../shared/utils/responseHandler';
import { Order } from '../../../shared/models/index.model';

export const checkout = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        
        const order = await OrderService.createOrder(userId, req.body);
        
        return sendResponse(res, 201, true, "Commande payée et placée en séquestre avec succès", order);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const confirmDelivery = async (req: Request, res: Response) => {
    try {
        const { orderId, otpCode } = req.body;
        
        if (!orderId || !otpCode) throw new Error("ID de commande et code OTP requis");
        const order = await OrderService.completeOrder(orderId, otpCode);
        
        return sendResponse(res, 200, true, "Livraison confirmée. Les fonds ont été libérés aux bénéficiaires.", order);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const orders = await Order.findAll({
            where: { clientId: userId },
            include: ['shop'],
            order: [['createdAt', 'DESC']]
        });
        
        return sendResponse(res, 200, true, "Historique des commandes récupéré", orders);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};