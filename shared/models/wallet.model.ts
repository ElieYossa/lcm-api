import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Wallet extends Model {
    public id!: string;
    public userId!: string;
    public balance!: number;
    public savingsBalance!: number;
    public currency!: string;
}

Wallet.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    userId: { 
        type: DataTypes.UUID, 
        allowNull: false, unique: true 
    },
    balance: { 
        type: DataTypes.DECIMAL(15, 2), 
        defaultValue: 0.00 
    },
    savingsBalance: { 
        type: DataTypes.DECIMAL(15, 2), 
        defaultValue: 0.00 
    },
    currency: { 
        type: DataTypes.STRING, 
        defaultValue: 'USD' 
    }
    
}, {
    sequelize, 
    tableName: 'wallets', 
    timestamps: true 
});

export default Wallet;