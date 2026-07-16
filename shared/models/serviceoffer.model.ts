import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum ServiceType {
    GENERAL = 'general',
    HOTEL = 'hotel',
    RESTAURANT = 'restaurant'
}

class ServiceOffer extends Model {
    public id!: string;
    public shopId!: string;
    public categoryId!: string;
    public name!: string;
    public description!: string;
    public type!: ServiceType;
    public totalPrice!: number;
    public depositAmount!: number;
    public features!: string;
    public address!: string;
    public latitude!: number;
    public longitude!: number;
    public status!: 'pending' | 'approved' | 'rejected';
    public image!: string | null;
}

ServiceOffer.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    shopId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(...Object.values(ServiceType)),
        defaultValue: ServiceType.GENERAL
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    depositAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'service_offers',
    timestamps: true
});

export default ServiceOffer;