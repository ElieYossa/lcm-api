import { Request, Response } from 'express';
import { ServiceProvisionService } from '../services/serviceProvision.service';
import { sendResponse } from '../../../shared/utils/responseHandler';
import { Booking } from '../../../shared/models/index.model';

export const offerService = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.shopId as string;
        const offer = await ServiceProvisionService.createServiceOffer(shopId, req.body);
        return sendResponse(res, 201, true, "Offre de service créée, en attente de validation admin", offer);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const requestBooking = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        const { serviceOfferId } = req.body;
        const booking = await ServiceProvisionService.bookRequest(clientId, serviceOfferId, req.body);
        return sendResponse(res, 201, true, "Réservation effectuée et acompte payé", booking);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const confirmService = async (req: Request, res: Response) => {
    try {
        const { bookingId, otpCode } = req.body;
        if (!bookingId || !otpCode) throw new Error("ID de réservation et code OTP requis");

        const result = await ServiceProvisionService.completeService(bookingId, otpCode);
        return sendResponse(res, 200, true, "Prestation terminée, l'acompte a été versé au prestataire", result);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        const bookings = await Booking.findAll({
            where: { clientId },
            include: ['service'],
            order: [['startDate', 'DESC']]
        });
        return sendResponse(res, 200, true, "Vos réservations récupérées", bookings);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};