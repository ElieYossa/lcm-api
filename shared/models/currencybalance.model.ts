import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CurrencyBalance extends Model {
    public id!: string;
    public walletId!: string;
    public currency!: string;
    public amount!: number;
}

CurrencyBalance.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    walletId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    currency: { 
        type: DataTypes.STRING(10), 
        allowNull: false 
    },
    amount: { 
        type: DataTypes.DECIMAL(18, 8), 
        defaultValue: 0.00000000 
    }
}, { 
    sequelize, 
    tableName: 'currency_balances' 
});

export default CurrencyBalance;