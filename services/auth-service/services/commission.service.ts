import { Wallet, Transaction, User, CommissionConfig, sequelize } from '../../../shared/models/index.model';
import { CommissionType } from '../../../shared/models/commissionconfig.model';

export class CommissionService {

    static async distributeFunds(order: any) {
        const t = await sequelize.transaction();

        try {
            const { totalAmount, shopId, clientId } = order;

            const configs = await CommissionConfig.findAll({ where: { isActive: true }, transaction: t });
            const getRate = (type: CommissionType) =>
                Number(configs.find((c: CommissionConfig) => c.type === type)?.percentage || 0) / 100;

            const platformRate = getRate(CommissionType.PLATFORM_FEE);
            const userRefRate = getRate(CommissionType.USER_REFERRAL);
            const shopRefRate = getRate(CommissionType.SHOP_REFERRAL);

            const shop = await order.getShop({ transaction: t });
            const client = await User.findByPk(clientId, { transaction: t });

            const merchantId = shop.ownerId;
            const shopReferrerId = shop.referredBy;
            const userReferrerId = client?.referredBy;

            const platformGains = totalAmount * platformRate;
            let shopRefGains = 0;
            let userRefGains = 0;

            if (shopReferrerId) shopRefGains = totalAmount * shopRefRate;
            if (userReferrerId) userRefGains = totalAmount * userRefRate;

            const merchantNet = totalAmount - platformGains - shopRefGains - userRefGains;

            await this.creditWallet(merchantId, merchantNet, "Vente produit", order.id, t);
            if (shopRefGains > 0) await this.creditWallet(shopReferrerId!, shopRefGains, "Commission Parrainage Boutique", order.id, t);
            if (userRefGains > 0) await this.creditWallet(userReferrerId!, userRefGains, "Commission Parrainage Client", order.id, t);

            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    private static async creditWallet(userId: string, amount: number, desc: string, ref: string, t: any) {
        const wallet = await Wallet.findOne({ where: { userId }, transaction: t });
        if (wallet) {
            wallet.balance = Number(wallet.balance) + amount;
            await wallet.save({ transaction: t });
            await Transaction.create({
                walletId: wallet.id,
                amount,
                type: 'commission',
                description: desc,
                reference: ref
            }, { transaction: t });
        }
    }

    static async distributeServiceFunds(booking: any, transaction: any) {
        const offer = booking.service;
        const shop = offer.shop;
        const depositAmount = Number(booking.depositPaid);

        const configs = await CommissionConfig.findAll({ where: { isActive: true }, transaction });
        const platformRate = Number(configs.find(c => c.type === 'platform_fee')?.percentage || 0) / 100;

        const platformPart = depositAmount * platformRate;
        const merchantNet = depositAmount - platformPart;

        const merchantWallet = await Wallet.findOne({ where: { userId: shop.ownerId }, transaction });
        if (merchantWallet) {
            merchantWallet.balance = Number(merchantWallet.balance) + merchantNet;
            await merchantWallet.save({ transaction });

            await Transaction.create({
                walletId: merchantWallet.id,
                amount: merchantNet,
                type: 'commission' as any,
                description: `Libération acompte service: ${offer.name}`,
                reference: booking.id
            }, { transaction });
        }
    }
}