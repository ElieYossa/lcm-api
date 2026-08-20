"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProvisionService = void 0;
const index_model_1 = require("../../../shared/models/index.model");
const booking_model_1 = require("../../../shared/models/booking.model");
const commission_service_1 = require("../../auth-service/services/commission.service");
const nanoid_1 = require("nanoid");
class ServiceProvisionService {
    static async createServiceOffer(shopId, data) {
        if (data.features)
            data.features = JSON.stringify(data.features);
        return await index_model_1.ServiceOffer.create({
            ...data,
            shopId,
            status: 'pending'
        });
    }
    static async bookRequest(clientId, serviceOfferId, bookingData) {
        const t = await index_model_1.sequelize.transaction();
        try {
            const offer = await index_model_1.ServiceOffer.findByPk(serviceOfferId, { transaction: t });
            if (!offer)
                throw new Error("Service introuvable");
            const wallet = await index_model_1.Wallet.findOne({ where: { userId: clientId }, transaction: t });
            if (!wallet || Number(wallet.balance) < Number(offer.depositAmount)) {
                throw new Error("Solde insuffisant pour payer l'acompte de réservation");
            }
            wallet.balance = Number(wallet.balance) - Number(offer.depositAmount);
            await wallet.save({ transaction: t });
            const booking = await index_model_1.Booking.create({
                clientId,
                serviceOfferId,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate || null,
                depositPaid: offer.depositAmount,
                otpCode: (0, nanoid_1.nanoid)(6).toUpperCase(),
                status: booking_model_1.BookingStatus.PENDING
            }, { transaction: t });
            await index_model_1.Transaction.create({
                walletId: wallet.id,
                amount: -offer.depositAmount,
                type: 'payment',
                description: `Acompte réservation service : ${offer.name}`,
                reference: booking.id
            }, { transaction: t });
            await t.commit();
            return booking;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async completeService(bookingId, otpCode) {
        const booking = await index_model_1.Booking.findByPk(bookingId, {
            include: [{
                    model: index_model_1.ServiceOffer,
                    as: 'service',
                    include: [{ model: index_model_1.Shop, as: 'shop' }]
                }]
        });
        if (!booking)
            throw new Error("Réservation introuvable");
        if (booking.status === booking_model_1.BookingStatus.COMPLETED)
            throw new Error("Service déjà marqué comme terminé");
        if (booking.otpCode !== otpCode)
            throw new Error("Code de validation (OTP) incorrect");
        const t = await index_model_1.sequelize.transaction();
        try {
            booking.status = booking_model_1.BookingStatus.COMPLETED;
            await booking.save({ transaction: t });
            await commission_service_1.CommissionService.distributeServiceFunds(booking, t);
            await t.commit();
            return booking;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
exports.ServiceProvisionService = ServiceProvisionService;
