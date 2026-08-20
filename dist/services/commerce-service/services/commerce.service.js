"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceService = void 0;
const sequelize_1 = require("sequelize");
const index_model_1 = require("../../../shared/models/index.model");
const product_model_1 = require("../../../shared/models/product.model");
const shop_model_1 = require("../../../shared/models/shop.model");
const booking_model_1 = require("../../../shared/models/booking.model");
const nanoid_1 = require("nanoid");
class CommerceService {
    static async createShop(userId, shopData) {
        let referrerId = null;
        if (shopData.referredBy) {
            const referrer = await index_model_1.User.findOne({ where: { referralCode: shopData.referredBy } });
            if (referrer) {
                referrerId = referrer.id;
            }
        }
        return await index_model_1.Shop.create({
            ...shopData,
            ownerId: userId,
            referredBy: referrerId,
            status: shop_model_1.ShopStatus.PENDING,
            documents: shopData.documents || null
        });
    }
    static async getAllMyShops(userId) {
        return await index_model_1.Shop.findAll({
            where: { ownerId: userId },
            include: [{ model: index_model_1.Product, as: 'products' }]
        });
    }
    static async getMyProducts(userId, query) {
        const page = parseInt(query.page) || 1;
        const status = query.status !== "" ? query.status : undefined;
        const isActive = query.isActive !== "" ? query.isActive : undefined;
        const name = query.name !== "" ? query.name : undefined;
        const shopId = query.shopId !== "" ? query.shopId : undefined;
        const LIMIT = 8;
        const offset = (page - 1) * LIMIT;
        const myShops = await index_model_1.Shop.findAll({
            where: { ownerId: userId },
            attributes: ['id']
        });
        const shopIds = myShops.map(s => s.id);
        if (shopIds.length === 0) {
            return { totalItems: 0, totalPages: 0, currentPage: page, items: [] };
        }
        const whereClause = {
            shopId: { [sequelize_1.Op.in]: shopIds }
        };
        if (shopId) {
            if (shopIds.includes(shopId)) {
                whereClause.shopId = shopId;
            }
            else {
                throw new Error("Cette boutique ne vous appartient pas.");
            }
        }
        if (status)
            whereClause.status = status;
        if (isActive !== undefined) {
            whereClause.isActive = (isActive === 'true' || isActive === true);
        }
        if (name) {
            whereClause.name = { [sequelize_1.Op.like]: `%${name}%` };
        }
        const { count, rows } = await index_model_1.Product.findAndCountAll({
            where: whereClause,
            limit: LIMIT,
            offset: offset,
            distinct: true,
            include: [
                { model: index_model_1.Shop, as: 'shop', attributes: ['name', 'logo'] },
                { model: index_model_1.Category, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / LIMIT),
            currentPage: page,
            items: rows
        };
    }
    static async getShopById(shopId) {
        return await index_model_1.Shop.findByPk(shopId, { include: ['products', 'services'] });
    }
    static async updateShop(shopId, userId, updateData) {
        const shop = await index_model_1.Shop.findByPk(shopId);
        if (!shop)
            throw new Error("Boutique introuvable");
        if (shop.ownerId !== userId)
            throw new Error("Action non autorisée");
        if (updateData.documents)
            updateData.documents = JSON.stringify(updateData.documents);
        return await shop.update(updateData);
    }
    static async deleteShop(shopId, userId) {
        const shop = await index_model_1.Shop.findByPk(shopId);
        if (!shop || shop.ownerId !== userId)
            throw new Error("Accès refusé");
        return await shop.destroy();
    }
    static async addProduct(shopId, productData) {
        const shop = await index_model_1.Shop.findByPk(shopId);
        if (!shop || shop.status !== shop_model_1.ShopStatus.APPROVED) {
            throw new Error("Impossible d'ajouter des produits : Boutique non approuvée par l'admin.");
        }
        const images = Array.isArray(productData.icon)
            ? JSON.stringify(productData.icon)
            : JSON.stringify([productData.icon]);
        return await index_model_1.Product.create({
            ...productData,
            shopId,
            images,
            status: product_model_1.ProductStatus.PENDING
        });
    }
    static async updateProduct(productId, userId, updateData) {
        const product = await index_model_1.Product.findByPk(productId, { include: [{ model: index_model_1.Shop, as: 'shop' }] });
        if (!product || product.shop?.ownerId !== userId)
            throw new Error("Action non autorisée");
        const criticalFields = ['name', 'description', 'price', 'images', 'categoryId', 'subCategoryId'];
        const needsRevalidation = criticalFields.some(field => updateData[field] !== undefined);
        if (needsRevalidation) {
            updateData.status = product_model_1.ProductStatus.PENDING;
            updateData.rejectionReason = null;
        }
        if (updateData.images) {
            updateData.images = Array.isArray(updateData.images)
                ? JSON.stringify(updateData.images)
                : JSON.stringify([updateData.images]);
        }
        return await product.update(updateData);
    }
    static async deleteProduct(productId, userId) {
        const product = await index_model_1.Product.findByPk(productId, { include: [{ model: index_model_1.Shop, as: 'shop' }] });
        if (!product || product.shop?.ownerId !== userId)
            throw new Error("Action non autorisée");
        return await product.destroy();
    }
    static async createServiceOffer(shopId, data) {
        if (data.features)
            data.features = JSON.stringify(data.features);
        return await index_model_1.ServiceOffer.create({ ...data, shopId, status: 'pending' });
    }
    static async bookRequest(clientId, serviceOfferId, bookingData) {
        const t = await index_model_1.sequelize.transaction();
        try {
            const offer = await index_model_1.ServiceOffer.findByPk(serviceOfferId, { transaction: t });
            if (!offer)
                throw new Error("Service introuvable");
            const wallet = await index_model_1.Wallet.findOne({ where: { userId: clientId }, transaction: t });
            if (!wallet || wallet.balance < offer.depositAmount)
                throw new Error("Solde insuffisant pour l'acompte");
            wallet.balance = Number(wallet.balance) - Number(offer.depositAmount);
            await wallet.save({ transaction: t });
            const booking = await index_model_1.Booking.create({
                clientId,
                serviceOfferId,
                startDate: bookingData.startDate,
                depositPaid: offer.depositAmount,
                otpCode: (0, nanoid_1.nanoid)(6).toUpperCase(),
                status: booking_model_1.BookingStatus.PENDING
            }, { transaction: t });
            await t.commit();
            return booking;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async getApprovedProducts(query) {
        const { name, categoryId, subCategoryId, page = 1 } = query;
        const LIMIT = 10;
        const offset = (Number(page) - 1) * LIMIT;
        const whereClause = {
            status: product_model_1.ProductStatus.APPROVED,
            isActive: true
        };
        if (name) {
            whereClause.name = { [sequelize_1.Op.like]: `%${name}%` };
        }
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }
        if (subCategoryId) {
            whereClause.subCategoryId = subCategoryId;
        }
        const { count, rows } = await index_model_1.Product.findAndCountAll({
            where: whereClause,
            limit: LIMIT,
            offset: offset,
            include: [{
                    model: index_model_1.Shop,
                    as: 'shop',
                    where: { status: shop_model_1.ShopStatus.APPROVED },
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
    static async getNearbyShops(lat, lng, radius = 10) {
        const distanceField = sequelize_1.Sequelize.literal(`(
            6371 * acos(
                cos(radians(${lat})) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(${lng})) +
                sin(radians(${lat})) * sin(radians(latitude))
            )
        )`);
        return await index_model_1.Shop.findAll({
            attributes: { include: [[distanceField, 'distance']] },
            where: { status: shop_model_1.ShopStatus.APPROVED },
            having: sequelize_1.Sequelize.literal(`distance <= ${radius}`),
            order: distanceField,
        });
    }
    static async getNearbyProducts(query) {
        const { lat, lng, radius = 10, page = 1, name, categoryId, subCategoryId } = query;
        const LIMIT = 10;
        const offset = (Number(page) - 1) * LIMIT;
        const distanceField = sequelize_1.Sequelize.literal(`(
            6371 * acos(
                cos(radians(${Number(lat)})) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(${Number(lng)})) +
                sin(radians(${Number(lat)})) * sin(radians(latitude))
            )
        )`);
        const productWhere = {
            status: product_model_1.ProductStatus.APPROVED,
            isActive: true
        };
        if (name)
            productWhere.name = { [sequelize_1.Op.like]: `%${name}%` };
        if (categoryId)
            productWhere.categoryId = categoryId;
        if (subCategoryId)
            productWhere.subCategoryId = subCategoryId;
        const { count, rows } = await index_model_1.Product.findAndCountAll({
            where: productWhere,
            limit: LIMIT,
            offset: offset,
            distinct: true,
            include: [{
                    model: index_model_1.Shop,
                    as: 'shop',
                    attributes: {
                        include: [[distanceField, 'distance']]
                    },
                    where: {
                        status: shop_model_1.ShopStatus.APPROVED,
                        [sequelize_1.Op.and]: [
                            sequelize_1.Sequelize.where(distanceField, { [sequelize_1.Op.lte]: Number(radius) })
                        ]
                    },
                    required: true
                }],
            order: [[sequelize_1.Sequelize.literal('`shop.distance`'), 'ASC']]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / LIMIT),
            currentPage: Number(page),
            radius: `${radius}km`,
            products: rows
        };
    }
    static async getDeliveryStatus(orderId, clientId) {
        const order = await index_model_1.Order.findOne({
            where: { id: orderId, clientId },
            include: [{ model: index_model_1.Shop, as: 'shop', attributes: ['name', 'address'] }]
        });
        if (!order)
            throw new Error("Commande introuvable");
        const delivery = await index_model_1.Delivery.findOne({ where: { orderId: order.id } });
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
exports.CommerceService = CommerceService;
