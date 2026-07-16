import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum CommissionType {
    USER_REFERRAL = 'user_referral',
    SHOP_REFERRAL = 'shop_referral',
    PLATFORM_FEE = 'platform_fee' 
}

class CommissionConfig extends Model {
    public id!: string;
    public type!: CommissionType;
    public percentage!: number;
    public isActive!: boolean;
    public description!: string;
}

CommissionConfig.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    type: { 
        type: DataTypes.ENUM(...Object.values(CommissionType)), 
        allowNull: false,
        unique: true 
    },
    percentage: { 
        type: DataTypes.DECIMAL(5, 2), 
        allowNull: false 
    },
    isActive: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
    description: { 
        type: DataTypes.STRING, 
        allowNull: true 
        }
}, { 
    sequelize, 
    tableName: 'commission_configs', 
    timestamps: true 
});

export default CommissionConfig;