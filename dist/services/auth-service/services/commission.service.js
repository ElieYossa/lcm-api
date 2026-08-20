"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const index_model_1 = require("../../../shared/models/index.model");
const commissionconfig_model_1 = require("../../../shared/models/commissionconfig.model");
class CommissionService {
    static async distributeFunds(order) {
        const t = await index_model_1.sequelize.transaction();
        try {
            const { totalAmount, shopId, clientId } = order;
            const configs = await index_model_1.CommissionConfig.findAll({ where: { isActive: true }, transaction: t });
            const getRate = (type) => Number(configs.find((c) => c.type === type)?.percentage || 0) / 100;
            const platformRate = getRate(commissionconfig_model_1.CommissionType.PLATFORM_FEE);
            const userRefRate = getRate(commissionconfig_model_1.CommissionType.USER_REFERRAL);
            const shopRefRate = getRate(commissionconfig_model_1.CommissionType.SHOP_REFERRAL);
            const shop = await order.getShop({ transaction: t });
            const client = await index_model_1.User.findByPk(clientId, { transaction: t });
            const merchantId = shop.ownerId;
            const shopReferrerId = shop.referredBy;
            const userReferrerId = client?.referredBy;
            const platformGains = totalAmount * platformRate;
            let shopRefGains = 0;
            let userRefGains = 0;
            if (shopReferrerId)
                shopRefGains = totalAmount * shopRefRate;
            if (userReferrerId)
                userRefGains = totalAmount * userRefRate;
            const merchantNet = totalAmount - platformGains - shopRefGains - userRefGains;
            await this.creditWallet(merchantId, merchantNet, "Vente produit", order.id, t);
            if (shopRefGains > 0)
                await this.creditWallet(shopReferrerId, shopRefGains, "Commission Parrainage Boutique", order.id, t);
            if (userRefGains > 0)
                await this.creditWallet(userReferrerId, userRefGains, "Commission Parrainage Client", order.id, t);
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async creditWallet(userId, amount, desc, ref, t) {
        const wallet = await index_model_1.Wallet.findOne({ where: { userId }, transaction: t });
        if (wallet) {
            wallet.balance = Number(wallet.balance) + amount;
            await wallet.save({ transaction: t });
            await index_model_1.Transaction.create({
                walletId: wallet.id,
                amount,
                type: 'commission',
                description: desc,
                reference: ref
            }, { transaction: t });
        }
    }
    static async distributeServiceFunds(booking, transaction) {
        const offer = booking.service;
        const shop = offer.shop;
        const depositAmount = Number(booking.depositPaid);
        const configs = await index_model_1.CommissionConfig.findAll({ where: { isActive: true }, transaction });
        const platformRate = Number(configs.find(c => c.type === 'platform_fee')?.percentage || 0) / 100;
        const platformPart = depositAmount * platformRate;
        const merchantNet = depositAmount - platformPart;
        const merchantWallet = await index_model_1.Wallet.findOne({ where: { userId: shop.ownerId }, transaction });
        if (merchantWallet) {
            merchantWallet.balance = Number(merchantWallet.balance) + merchantNet;
            await merchantWallet.save({ transaction });
            await index_model_1.Transaction.create({
                walletId: merchantWallet.id,
                amount: merchantNet,
                type: 'commission',
                description: `Libération acompte service: ${offer.name}`,
                reference: booking.id
            }, { transaction });
        }
    }
}
exports.CommissionService = CommissionService;
