"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const index_model_1 = require("../../../shared/models/index.model");
const order_model_1 = require("../../../shared/models/order.model");
const commissionconfig_model_1 = require("../../../shared/models/commissionconfig.model");
const commission_service_1 = require("../../auth-service/services/commission.service");
const nanoid_1 = require("nanoid");
class OrderService {
    static async createOrder(clientId, orderData) {
        const { shopId, items, deliveryType, shippingAddress } = orderData;
        const t = await index_model_1.sequelize.transaction();
        try {
            const configs = await index_model_1.CommissionConfig.findAll({ where: { isActive: true }, transaction: t });
            const getRate = (type) => Number(configs.find(c => c.type === type)?.percentage || 0) / 100;
            const platformRate = getRate(commissionconfig_model_1.CommissionType.PLATFORM_FEE);
            const userRefRate = getRate(commissionconfig_model_1.CommissionType.USER_REFERRAL);
            const shopRefRate = getRate(commissionconfig_model_1.CommissionType.SHOP_REFERRAL);
            let totalAmount = 0;
            for (const item of items) {
                const product = await index_model_1.Product.findByPk(item.productId, { transaction: t });
                if (!product || product.stockQuantity < item.quantity) {
                    throw new Error(`Stock insuffisant pour : ${product?.name || 'Produit inconnu'}`);
                }
                product.stockQuantity -= item.quantity;
                await product.save({ transaction: t });
                totalAmount += Number(product.price) * item.quantity;
            }
            const clientWallet = await index_model_1.Wallet.findOne({ where: { userId: clientId }, transaction: t });
            if (!clientWallet || Number(clientWallet.balance) < totalAmount) {
                throw new Error("Solde insuffisant dans votre portefeuille LCM.");
            }
            clientWallet.balance = Number(clientWallet.balance) - totalAmount;
            await clientWallet.save({ transaction: t });
            const platformFee = totalAmount * platformRate;
            const shop = await index_model_1.Shop.findByPk(shopId, { transaction: t });
            const client = await index_model_1.User.findByPk(clientId, { transaction: t });
            let referralFee = 0;
            if (shop?.referredBy)
                referralFee += (totalAmount * shopRefRate);
            if (client?.referredBy)
                referralFee += (totalAmount * userRefRate);
            const order = await index_model_1.Order.create({
                clientId,
                shopId,
                totalAmount,
                platformFee,
                referralFee,
                deliveryType,
                shippingAddress,
                status: order_model_1.OrderStatus.PAID,
                otpCode: (0, nanoid_1.nanoid)(6).toUpperCase()
            }, { transaction: t });
            for (const item of items) {
                const product = await index_model_1.Product.findByPk(item.productId, { transaction: t });
                await index_model_1.OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: product.price
                }, { transaction: t });
            }
            await index_model_1.Transaction.create({
                walletId: clientWallet.id,
                amount: -totalAmount,
                type: 'payment',
                description: `Paiement commande LCM #${order.id}`,
                reference: order.id
            }, { transaction: t });
            await t.commit();
            return order;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async completeOrder(orderId, otpCode) {
        const order = await index_model_1.Order.findByPk(orderId, { include: [{ model: index_model_1.Shop, as: 'shop' }] });
        if (!order)
            throw new Error("Commande introuvable");
        if (order.status === order_model_1.OrderStatus.COMPLETED)
            throw new Error("Cette commande est déjà finalisée");
        if (order.otpCode !== otpCode)
            throw new Error("Code OTP invalide. La livraison ne peut pas être confirmée.");
        order.status = order_model_1.OrderStatus.COMPLETED;
        await order.save();
        await commission_service_1.CommissionService.distributeFunds(order);
        return order;
    }
}
exports.OrderService = OrderService;
