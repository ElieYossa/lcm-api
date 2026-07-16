import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum DeliveryStatus {
    ASSIGNED = 'assigned',
    PICKED_UP = 'picked_up',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    COMPLETED = 'completed' 
}

class Delivery extends Model {
    public id!: string;
    public orderId!: string;
    public driverId!: string;
    public status!: DeliveryStatus;
    public currentLat!: number | null;
    public currentLng!: number | null;
    public pickedAt!: Date | null;
    public deliveredAt!: Date | null;
    public updatedAt!: Date;
}

Delivery.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    orderId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        unique: true 
    },
    driverId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM(...Object.values(DeliveryStatus)), 
        defaultValue: DeliveryStatus.ASSIGNED 
    },
    currentLat: { 
        type: DataTypes.DECIMAL(10, 8), 
        allowNull: true 
    },
    currentLng: { 
        type: DataTypes.DECIMAL(11, 8), 
        allowNull: true 
    },
    pickedAt: { 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    deliveredAt: { 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    updatedAt: { 
        type: DataTypes.DATE, 
        allowNull: true 
    }
}, { 
    sequelize, 
    tableName: 'deliveries', 
    timestamps: true 
});

export default Delivery;