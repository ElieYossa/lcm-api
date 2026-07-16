import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class SavingsPlan extends Model {
    public id!: string;
    public name!: string;
    public durationMonths!: number;
    public interestRate!: number;
    public minAmount!: number;
}

SavingsPlan.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    durationMonths: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    interestRate: { 
        type: DataTypes.DECIMAL(5, 2), 
        allowNull: false 
    },
    minAmount: { 
        type: DataTypes.DECIMAL(15, 2), 
        defaultValue: 0 
    }
}, { 
    sequelize, 
    tableName: 'savings_plans', 
    timestamps: true 
});

export default SavingsPlan;