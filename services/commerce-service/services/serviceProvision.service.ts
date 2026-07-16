import { 
    ServiceOffer, Booking, sequelize, Wallet, Transaction, Shop 
} from '../../../shared/models/index.model';
import { BookingStatus } from '../../../shared/models/booking.model';
import { CommissionService } from '../../auth-service/services/commission.service';
import { nanoid } from 'nanoid';

export class ServiceProvisionService {

    static async createServiceOffer(shopId: string, data: any) {
        if (data.features) data.features = JSON.stringify(data.features);
        
        return await ServiceOffer.create({ 
            ...data, 
            shopId, 
            status: 'pending'
        });
    }

  
    static async bookRequest(clientId: string, serviceOfferId: string, bookingData: any) {
        const t = await sequelize.transaction();
        try {
            const offer = await ServiceOffer.findByPk(serviceOfferId, { transaction: t });
            if (!offer) throw new Error("Service introuvable");

            const wallet = await Wallet.findOne({ where: { userId: clientId }, transaction: t });
            if (!wallet || Number(wallet.balance) < Number(offer.depositAmount)) {
                throw new Error("Solde insuffisant pour payer l'acompte de réservation");
            }

            wallet.balance = Number(wallet.balance) - Number(offer.depositAmount);
            await wallet.save({ transaction: t });

            const booking = await Booking.create({
                clientId,
                serviceOfferId,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate || null,
                depositPaid: offer.depositAmount,
                otpCode: nanoid(6).toUpperCase(), 
                status: BookingStatus.PENDING
            }, { transaction: t });

            await Transaction.create({
                walletId: wallet.id,
                amount: -offer.depositAmount, 
                type: 'payment' as any,
                description: `Acompte réservation service : ${offer.name}`,
                reference: booking.id
            }, { transaction: t });

            await t.commit();
            return booking;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }


    static async completeService(bookingId: string, otpCode: string) {
        const booking = await Booking.findByPk(bookingId, { 
            include: [{ 
                model: ServiceOffer, 
                as: 'service',
                include: [{ model: Shop, as: 'shop' }] 
            }] 
        });

        if (!booking) throw new Error("Réservation introuvable");
        if (booking.status === BookingStatus.COMPLETED) throw new Error("Service déjà marqué comme terminé");
        if (booking.otpCode !== otpCode) throw new Error("Code de validation (OTP) incorrect");

        const t = await sequelize.transaction();
        try {
            booking.status = BookingStatus.COMPLETED;
            await booking.save({ transaction: t });

            await CommissionService.distributeServiceFunds(booking, t);

            await t.commit();
            return booking;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}