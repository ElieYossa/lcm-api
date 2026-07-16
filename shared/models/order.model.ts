import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Shop } from './index.model';

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

class Order extends Model {
    public id!: string;
    public clientId!: string;
    public shopId!: string;
    public totalAmount!: number;
    public platformFee!: number; 
    public referralFee!: number;
    public status!: OrderStatus;
    public deliveryType!: 'pickup' | 'delivery';
    public shippingAddress!: string | null;
    public otpCode!: string; 
    public readonly shop?: Shop;
}

Order.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    clientId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    shopId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    totalAmount: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    platformFee: { 
        type: DataTypes.DECIMAL(10, 2), 
        defaultValue: 0 
    },
    referralFee: { 
        type: DataTypes.DECIMAL(10, 2), 
        defaultValue: 0 
    },
    status: { 
        type: DataTypes.ENUM(...Object.values(OrderStatus)), 
        defaultValue: OrderStatus.PENDING 
    },
    deliveryType: { 
        type: DataTypes.ENUM('pickup', 'delivery'), 
        allowNull: false 
    },
    shippingAddress: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    otpCode: { 
        type: DataTypes.STRING(10), 
        allowNull: false 
    }
}, { sequelize, tableName: 'orders', timestamps: true });

export default Order;