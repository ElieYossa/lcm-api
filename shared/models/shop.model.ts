import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum ShopStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended'
}

class Shop extends Model {
    public id!: string;
    public ownerId!: string;
    public name!: string;
    public description!: string;
    public address!: string;
    public latitude!: number;
    public longitude!: number;
    public status!: ShopStatus;
    public logo!: string | null;
    public documents!: string | null;
    public referredBy!: string | null; 
}

Shop.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
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
        type: DataTypes.ENUM(...Object.values(ShopStatus)),
        defaultValue: ShopStatus.PENDING
    },
    logo: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    documents: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    referredBy: { 
        type: DataTypes.UUID, 
        allowNull: true,
        references: { model: 'users', key: 'id' }
    }
}, { 
    sequelize, 
    tableName: 'shops', 
    timestamps: true 
});

export default Shop;