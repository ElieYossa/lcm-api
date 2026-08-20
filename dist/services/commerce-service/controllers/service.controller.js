"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyBookings = exports.confirmService = exports.requestBooking = exports.offerService = void 0;
const serviceProvision_service_1 = require("../services/serviceProvision.service");
const responseHandler_1 = require("../../../shared/utils/responseHandler");
const index_model_1 = require("../../../shared/models/index.model");
const offerService = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const offer = await serviceProvision_service_1.ServiceProvisionService.createServiceOffer(shopId, req.body);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Offre de service créée, en attente de validation admin", offer);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.offerService = offerService;
const requestBooking = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { serviceOfferId } = req.body;
        const booking = await serviceProvision_service_1.ServiceProvisionService.bookRequest(clientId, serviceOfferId, req.body);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Réservation effectuée et acompte payé", booking);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.requestBooking = requestBooking;
const confirmService = async (req, res) => {
    try {
        const { bookingId, otpCode } = req.body;
        if (!bookingId || !otpCode)
            throw new Error("ID de réservation et code OTP requis");
        const result = await serviceProvision_service_1.ServiceProvisionService.completeService(bookingId, otpCode);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Prestation terminée, l'acompte a été versé au prestataire", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.confirmService = confirmService;
const getMyBookings = async (req, res) => {
    try {
        const clientId = req.user.id;
        const bookings = await index_model_1.Booking.findAll({
            where: { clientId },
            include: ['service'],
            order: [['startDate', 'DESC']]
        });
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Vos réservations récupérées", bookings);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getMyBookings = getMyBookings;
