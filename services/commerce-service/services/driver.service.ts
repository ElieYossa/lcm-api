import { Delivery, Order, Shop, sequelize } from '../../../shared/models/index.model';
import { DeliveryStatus } from '../../../shared/models/delivery.model';
import { OrderStatus } from '../../../shared/models/order.model';

export class DriverService {

    static async getAvailableOrders() {
        return await Order.findAll({
            where: { 
                status: OrderStatus.PAID, 
                deliveryType: 'delivery' 
            },
            include: [{ 
                model: Shop, 
                as: 'shop',
                attributes: ['name', 'address', 'latitude', 'longitude'] 
            }]
        });
    }

    static async acceptDelivery(driverId: string, orderId: string) {
        const t = await sequelize.transaction();

        try {
            const order = await Order.findByPk(orderId, { transaction: t, lock: t.LOCK.UPDATE });
            
            if (!order || order.status !== OrderStatus.PAID) {
                throw new Error("Désolé, cette commande n'est plus disponible ou déjà assignée.");
            }

            const delivery = await Delivery.create({
                orderId,
                driverId,
                status: DeliveryStatus.ASSIGNED
            }, { transaction: t });

            order.status = OrderStatus.SHIPPED;
            await order.save({ transaction: t });

            await t.commit();
            return delivery;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async getMyActiveDeliveries(driverId: string) {
        return await Delivery.findAll({
            where: { 
                driverId,
                status: ['assigned', 'picked_up', 'in_transit', 'delivered']
            },
            include: [{ model: Order, as: 'order', include: ['shop'] }]
        });
    }

    
    static async pickUpOrder(deliveryId: string, driverId: string) {
        const delivery = await Delivery.findOne({ where: { id: deliveryId, driverId } });
        if (!delivery) throw new Error("Livraison introuvable ou non assignée à vous.");

        delivery.status = DeliveryStatus.PICKED_UP;
        delivery.pickedAt = new Date();
        return await delivery.save();
    }

    static async updateLocation(deliveryId: string, driverId: string, lat: number, lng: number) {
        const delivery = await Delivery.findOne({ where: { id: deliveryId, driverId } });
        if (!delivery) throw new Error("Livraison non trouvée");

        delivery.currentLat = Number(lat);
        delivery.currentLng = Number(lng);
        return await delivery.save();
    }

    static async arriveAtDestination(deliveryId: string, driverId: string) {
        const delivery = await Delivery.findOne({ where: { id: deliveryId, driverId } });
        if (!delivery) throw new Error("Livraison introuvable");

        delivery.status = DeliveryStatus.DELIVERED;
        delivery.deliveredAt = new Date();
        return await delivery.save();
    }
}