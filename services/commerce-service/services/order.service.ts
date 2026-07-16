import { 
    sequelize, Order, OrderItem, Product, User, Shop, Wallet, Transaction, CommissionConfig 
} from '../../../shared/models/index.model';
import { OrderStatus } from '../../../shared/models/order.model';
import { CommissionType } from '../../../shared/models/commissionconfig.model';
import { CommissionService } from '../../auth-service/services/commission.service';
import { nanoid } from 'nanoid';

export class OrderService {

    static async createOrder(clientId: string, orderData: any) {
        const { shopId, items, deliveryType, shippingAddress } = orderData;
        const t = await sequelize.transaction();

        try {
            const configs = await CommissionConfig.findAll({ where: { isActive: true }, transaction: t });
            const getRate = (type: CommissionType) => 
                Number(configs.find(c => c.type === type)?.percentage || 0) / 100;

            const platformRate = getRate(CommissionType.PLATFORM_FEE);
            const userRefRate = getRate(CommissionType.USER_REFERRAL);
            const shopRefRate = getRate(CommissionType.SHOP_REFERRAL);


            let totalAmount = 0;
            for (const item of items) {
                const product = await Product.findByPk(item.productId, { transaction: t });
                if (!product || product.stockQuantity < item.quantity) {
                    throw new Error(`Stock insuffisant pour : ${product?.name || 'Produit inconnu'}`);
                }
                product.stockQuantity -= item.quantity;
                await product.save({ transaction: t });

                totalAmount += Number(product.price) * item.quantity;
            }

            const clientWallet = await Wallet.findOne({ where: { userId: clientId }, transaction: t });
            if (!clientWallet || Number(clientWallet.balance) < totalAmount) {
                throw new Error("Solde insuffisant dans votre portefeuille LCM.");
            }

            clientWallet.balance = Number(clientWallet.balance) - totalAmount;
            await clientWallet.save({ transaction: t });

            const platformFee = totalAmount * platformRate;
            
            const shop = await Shop.findByPk(shopId, { transaction: t });
            const client = await User.findByPk(clientId, { transaction: t });
            
            let referralFee = 0;
            if (shop?.referredBy) referralFee += (totalAmount * shopRefRate);
            if (client?.referredBy) referralFee += (totalAmount * userRefRate);

            const order = await Order.create({
                clientId,
                shopId,
                totalAmount,
                platformFee,
                referralFee,
                deliveryType,
                shippingAddress,
                status: OrderStatus.PAID,
                otpCode: nanoid(6).toUpperCase()
            }, { transaction: t });

            for (const item of items) {
                const product = await Product.findByPk(item.productId, { transaction: t });
                await OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: product!.price
                }, { transaction: t });
            }

            await Transaction.create({
                walletId: clientWallet.id,
                amount: -totalAmount,
                type: 'payment' as any,
                description: `Paiement commande LCM #${order.id}`,
                reference: order.id
            }, { transaction: t });

            await t.commit();
            return order;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async completeOrder(orderId: string, otpCode: string) {
        const order = await Order.findByPk(orderId, { include: [{ model: Shop, as: 'shop' }] });
        
        if (!order) throw new Error("Commande introuvable");
        if (order.status === OrderStatus.COMPLETED) throw new Error("Cette commande est déjà finalisée");
        if (order.otpCode !== otpCode) throw new Error("Code OTP invalide. La livraison ne peut pas être confirmée.");

        order.status = OrderStatus.COMPLETED;
        await order.save();

        await CommissionService.distributeFunds(order);
        
        return order;
    }
}