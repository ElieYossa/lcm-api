import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum TransactionType {
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal',
    PAYMENT = 'payment',
    COMMISSION = 'commission',
    TRANSFER = 'transfer'
}

class Transaction extends Model {
    public id!: string;
    public walletId!: string;
    public amount!: number;
    public type!: TransactionType;
    public status!: 'pending' | 'completed' | 'failed';
    public description!: string;
    public reference!: string; 
}

Transaction.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    walletId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    amount: { 
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false 
    },
    type: { 
        type: DataTypes.ENUM(...Object.values(TransactionType)), 
        allowNull: false },
    status: { 
        type: DataTypes.ENUM('pending', 'completed', 'failed'), 
        defaultValue: 'completed' 
    },
    description: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    reference: { 
        type: DataTypes.STRING, 
        allowNull: true 
    }
}, { 
    sequelize, 
    tableName: 'transactions', 
    timestamps: true 
});

export default Transaction;