import { Request, Response } from 'express';
import { DriverService } from '../services/driver.service';
import { sendResponse } from '../../../shared/utils/responseHandler';

export const listAvailable = async (req: Request, res: Response) => {
    try {
        const orders = await DriverService.getAvailableOrders();
        return sendResponse(res, 200, true, "Commandes prêtes à être livrées", orders);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getMyDeliveries = async (req: Request, res: Response) => {
    try {
        const driverId = (req as any).user.id;
        const myDeliveries = await DriverService.getMyActiveDeliveries(driverId);
        return sendResponse(res, 200, true, "Vos livraisons actives", myDeliveries);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const acceptOrder = async (req: Request, res: Response) => {
    try {
        const driverId = (req as any).user.id;
        const { orderId } = req.body;
        const delivery = await DriverService.acceptDelivery(driverId, orderId);
        return sendResponse(res, 201, true, "Commande acceptée avec succès", delivery);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const updateGPS = async (req: Request, res: Response) => {
    try {
        const driverId = (req as any).user.id;
        const { deliveryId, lat, lng } = req.body;
        await DriverService.updateLocation(deliveryId, driverId, lat, lng);
        return sendResponse(res, 200, true, "Position GPS mise à jour");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const markAsPickedUp = async (req: Request, res: Response) => {
    try {
        const driverId = (req as any).user.id;
        const deliveryId = req.params.deliveryId as string;
        const delivery = await DriverService.pickUpOrder(deliveryId, driverId);
        return sendResponse(res, 200, true, "Colis récupéré à la boutique", delivery);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const markAsArrived = async (req: Request, res: Response) => {
    try {
        const driverId = (req as any).user.id;
        const deliveryId = req.params.deliveryId as string;
        const delivery = await DriverService.arriveAtDestination(deliveryId, driverId);
        return sendResponse(res, 200, true, "Arrivée confirmée. En attente du code OTP client.", delivery);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};