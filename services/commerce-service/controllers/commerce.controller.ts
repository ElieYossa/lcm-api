import { Request, Response } from 'express';
import { CommerceService } from '../services/commerce.service';
import { sendResponse } from '../../../shared/utils/responseHandler';


export const createShop = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const shop = await CommerceService.createShop(userId, req.body);
        return sendResponse(res, 201, true, "Demande de création de boutique envoyée", shop);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getMyShops = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const shops = await CommerceService.getAllMyShops(userId);
        return sendResponse(res, 200, true, "Vos boutiques récupérées", shops);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const updateShop = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const shop = await CommerceService.updateShop(req.params.shopId as string, userId, req.body);
        return sendResponse(res, 200, true, "Boutique mise à jour avec succès", shop);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const deleteShop = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        await CommerceService.deleteShop(req.params.shopId as string, userId);
        return sendResponse(res, 200, true, "Boutique supprimée définitivement");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const addProduct = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.shopId as string;
        const product = await CommerceService.addProduct(shopId, req.body);
        return sendResponse(res, 201, true, "Produit ajouté pour validation par l'admin", product);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const product = await CommerceService.updateProduct(req.params.productId as string, userId, req.body);
        return sendResponse(res, 200, true, "Produit mis à jour et soumis à nouveau pour validation", product);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        await CommerceService.deleteProduct(req.params.productId as string, userId);
        return sendResponse(res, 200, true, "Produit supprimé avec succès");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const listProducts = async (req: Request, res: Response) => {
    try {
        const products = await CommerceService.getApprovedProducts(req.query);
        return sendResponse(res, 200, true, "Liste des produits approuvés", products);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const offerService = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.shopId as string;
        const offer = await CommerceService.createServiceOffer(shopId, req.body);
        return sendResponse(res, 201, true, "Offre de service créée, en attente de validation admin", offer);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const requestBooking = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        const { serviceOfferId } = req.body;
        const booking = await CommerceService.bookRequest(clientId, serviceOfferId, req.body);
        return sendResponse(res, 201, true, "Réservation effectuée et acompte prélevé", booking);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const getNearbyShops = async (req: Request, res: Response) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) throw new Error("La latitude (lat) et la longitude (lng) sont requises");

        const shops = await CommerceService.getNearbyShops(
            Number(lat),
            Number(lng),
            radius ? Number(radius) : undefined
        );

        return sendResponse(res, 200, true, `${shops.length} boutique(s) trouvée(s) à proximité`, shops);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getNearbyProducts = async (req: Request, res: Response) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) throw new Error("Position GPS requise");

        const products = await CommerceService.getNearbyProducts(
            Number(lat),
            Number(lng),
            radius ? Number(radius) : undefined
        );

        return sendResponse(res, 200, true, "Produits trouvés à proximité", products);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const getOrderTracking = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        const orderId = req.params.orderId as string;

        const trackingInfo = await CommerceService.getDeliveryStatus(orderId, clientId);
        
        return sendResponse(res, 200, true, "Détails du suivi de livraison", trackingInfo);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};