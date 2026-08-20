"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const index_model_1 = require("../../../shared/models/index.model");
const delivery_model_1 = require("../../../shared/models/delivery.model");
const order_model_1 = require("../../../shared/models/order.model");
class DriverService {
    static async getAvailableOrders() {
        return await index_model_1.Order.findAll({
            where: {
                status: order_model_1.OrderStatus.PAID,
                deliveryType: 'delivery'
            },
            include: [{
                    model: index_model_1.Shop,
                    as: 'shop',
                    attributes: ['name', 'address', 'latitude', 'longitude']
                }]
        });
    }
    static async acceptDelivery(driverId, orderId) {
        const t = await index_model_1.sequelize.transaction();
        try {
            const order = await index_model_1.Order.findByPk(orderId, { transaction: t, lock: t.LOCK.UPDATE });
            if (!order || order.status !== order_model_1.OrderStatus.PAID) {
                throw new Error("Désolé, cette commande n'est plus disponible ou déjà assignée.");
            }
            const delivery = await index_model_1.Delivery.create({
                orderId,
                driverId,
                status: delivery_model_1.DeliveryStatus.ASSIGNED
            }, { transaction: t });
            order.status = order_model_1.OrderStatus.SHIPPED;
            await order.save({ transaction: t });
            await t.commit();
            return delivery;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async getMyActiveDeliveries(driverId) {
        return await index_model_1.Delivery.findAll({
            where: {
                driverId,
                status: ['assigned', 'picked_up', 'in_transit', 'delivered']
            },
            include: [{ model: index_model_1.Order, as: 'order', include: ['shop'] }]
        });
    }
    static async pickUpOrder(deliveryId, driverId) {
        const delivery = await index_model_1.Delivery.findOne({ where: { id: deliveryId, driverId } });
        if (!delivery)
            throw new Error("Livraison introuvable ou non assignée à vous.");
        delivery.status = delivery_model_1.DeliveryStatus.PICKED_UP;
        delivery.pickedAt = new Date();
        return await delivery.save();
    }
    static async updateLocation(deliveryId, driverId, lat, lng) {
        const delivery = await index_model_1.Delivery.findOne({ where: { id: deliveryId, driverId } });
        if (!delivery)
            throw new Error("Livraison non trouvée");
        delivery.currentLat = Number(lat);
        delivery.currentLng = Number(lng);
        return await delivery.save();
    }
    static async arriveAtDestination(deliveryId, driverId) {
        const delivery = await index_model_1.Delivery.findOne({ where: { id: deliveryId, driverId } });
        if (!delivery)
            throw new Error("Livraison introuvable");
        delivery.status = delivery_model_1.DeliveryStatus.DELIVERED;
        delivery.deliveredAt = new Date();
        return await delivery.save();
    }
}
exports.DriverService = DriverService;
