import { Sequelize, Op } from 'sequelize';
import {
    Shop, Product, Category, SubCategory,
    Delivery, Order, ServiceOffer, Booking,
    Wallet, Transaction, sequelize,
    User
} from '../../../shared/models/index.model';
import { ProductStatus } from '../../../shared/models/product.model';
import { ShopStatus } from '../../../shared/models/shop.model';
import { BookingStatus } from '../../../shared/models/booking.model';
import { nanoid } from 'nanoid';

export class CommerceService {
    static async createShop(userId: string, shopData: any) {
        let referrerId = null;
        
        if (shopData.referredBy) {
            const referrer = await User.findOne({ where: { referralCode: shopData.referredBy } });
            if (referrer) {
                referrerId = referrer.id;
            }
        }

        return await Shop.create({
            ...shopData,
            ownerId: userId,
            referredBy: referrerId,
            status: ShopStatus.PENDING,
            documents: shopData.documents || null
        });
    }

    static async getAllMyShops(userId: string) {
        return await Shop.findAll({
            where: { ownerId: userId },
            include: [{ model: Product, as: 'products' }]
        });
    }

    static async getShopById(shopId: string) {
        return await Shop.findByPk(shopId, { include: ['products', 'services'] });
    }

    static async updateShop(shopId: string, userId: string, updateData: any) {
        const shop = await Shop.findByPk(shopId);
        if (!shop) throw new Error("Boutique introuvable");
        if (shop.ownerId !== userId) throw new Error("Action non autorisée");

        if (updateData.documents) updateData.documents = JSON.stringify(updateData.documents);

        return await shop.update(updateData);
    }

    static async deleteShop(shopId: string, userId: string) {
        const shop = await Shop.findByPk(shopId);
        if (!shop || shop.ownerId !== userId) throw new Error("Accès refusé");
        return await shop.destroy();
    }

    static async addProduct(shopId: string, productData: any) {
        const shop = await Shop.findByPk(shopId);
        if (!shop || shop.status !== ShopStatus.APPROVED) {
            throw new Error("Impossible d'ajouter des produits : Boutique non approuvée par l'admin.");
        }

        const images = Array.isArray(productData.images)
            ? JSON.stringify(productData.images)
            : JSON.stringify([productData.images]);

        return await Product.create({
            ...productData,
            shopId,
            images,
            status: ProductStatus.PENDING
        });
    }

    static async updateProduct(productId: string, userId: string, updateData: any) {
        const product = await Product.findByPk(productId, { include: [{ model: Shop, as: 'shop' }] });

        if (!product || product.shop?.ownerId !== userId) throw new Error("Action non autorisée");

        if (updateData.images) {
            updateData.images = Array.isArray(updateData.images) ? JSON.stringify(updateData.images) : JSON.stringify([updateData.images]);
        }

        updateData.status = ProductStatus.PENDING;
        updateData.rejectionReason = null;

        return await product.update(updateData);
    }

    static async deleteProduct(productId: string, userId: string) {
        const product = await Product.findByPk(productId, { include: [{ model: Shop, as: 'shop' }] });
        if (!product || product.shop?.ownerId !== userId) throw new Error("Action non autorisée");
        return await product.destroy();
    }


    static async createServiceOffer(shopId: string, data: any) {
        if (data.features) data.features = JSON.stringify(data.features);
        return await ServiceOffer.create({ ...data, shopId, status: 'pending' });
    }

    static async bookRequest(clientId: string, serviceOfferId: string, bookingData: any) {
        const t = await sequelize.transaction();
        try {
            const offer = await ServiceOffer.findByPk(serviceOfferId, { transaction: t });
            if (!offer) throw new Error("Service introuvable");

            const wallet = await Wallet.findOne({ where: { userId: clientId }, transaction: t });
            if (!wallet || wallet.balance < offer.depositAmount) throw new Error("Solde insuffisant pour l'acompte");

            wallet.balance = Number(wallet.balance) - Number(offer.depositAmount);
            await wallet.save({ transaction: t });

            const booking = await Booking.create({
                clientId,
                serviceOfferId,
                startDate: bookingData.startDate,
                depositPaid: offer.depositAmount,
                otpCode: nanoid(6).toUpperCase(),
                status: BookingStatus.PENDING
            }, { transaction: t });

            await t.commit();
            return booking;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }


    static async getApprovedProducts(query: any) {
        const { name, categoryId, subCategoryId, page = 1 } = query;

        const LIMIT = 10;
        const offset = (Number(page) - 1) * LIMIT;

        const whereClause: any = {
            status: ProductStatus.APPROVED,
            isActive: true
        };

        if (name) {
            whereClause.name = { [Op.like]: `%${name}%` };
        }

        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        if (subCategoryId) {
            whereClause.subCategoryId = subCategoryId;
        }

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            limit: LIMIT,
            offset: offset,
            include: [{
                model: Shop,
                as: 'shop',
                where: { status: ShopStatus.APPROVED },
                attributes: ['id', 'name', 'logo']
            }],
            order: [['createdAt', 'DESC']]
        });

        return {
            totalItems: count,
            totalPages: Math.ceil(count / LIMIT),
            currentPage: Number(page),
            itemsPerPage: LIMIT,
            products: rows
        };
    }

    static async getNearbyShops(lat: number, lng: number, radius: number = 10) {
        const distanceField = Sequelize.literal(`(
            6371 * acos(
                cos(radians(${lat})) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(${lng})) +
                sin(radians(${lat})) * sin(radians(latitude))
            )
        )`);

        return await Shop.findAll({
            attributes: { include: [[distanceField, 'distance']] },
            where: { status: ShopStatus.APPROVED },
            having: Sequelize.literal(`distance <= ${radius}`),
            order: distanceField,
        });
    }

    static async getNearbyProducts(query: any) {
        const { lat, lng, radius = 10, page = 1, name, categoryId, subCategoryId } = query;

        const LIMIT = 10;
        const offset = (Number(page) - 1) * LIMIT;

        const distanceField = Sequelize.literal(`(
            6371 * acos(
                cos(radians(${Number(lat)})) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(${Number(lng)})) +
                sin(radians(${Number(lat)})) * sin(radians(latitude))
            )
        )`);

        const productWhere: any = {
            status: ProductStatus.APPROVED,
            isActive: true
        };

        if (name) productWhere.name = { [Op.like]: `%${name}%` };
        if (categoryId) productWhere.categoryId = categoryId;
        if (subCategoryId) productWhere.subCategoryId = subCategoryId;

        const { count, rows } = await Product.findAndCountAll({
            where: productWhere,
            limit: LIMIT,
            offset: offset,
            distinct: true,
            include: [{
                model: Shop,
                as: 'shop',
                attributes: {
                    include: [[distanceField, 'distance']]
                },
                where: {
                    status: ShopStatus.APPROVED,
                    [Op.and]: [
                        Sequelize.where(distanceField, { [Op.lte]: Number(radius) })
                    ]
                },
                required: true
            }],
            order: [[Sequelize.literal('`shop.distance`'), 'ASC']]
        });

        return {
            totalItems: count,
            totalPages: Math.ceil(count / LIMIT),
            currentPage: Number(page),
            radius: `${radius}km`,
            products: rows
        };
    }


    static async getDeliveryStatus(orderId: string, clientId: string) {
        const order = await Order.findOne({
            where: { id: orderId, clientId },
            include: [{ model: Shop, as: 'shop', attributes: ['name', 'address'] }]
        });

        if (!order) throw new Error("Commande introuvable");

        const delivery = await Delivery.findOne({ where: { orderId: order.id } });

        return {
            orderStatus: order.status,
            deliveryStatus: delivery ? delivery.status : 'Non assigné',
            driverLocation: delivery ? {
                lat: delivery.currentLat,
                lng: delivery.currentLng,
                updatedAt: delivery.updatedAt
            } : null,
            shop: order.shop
        };
    }
}