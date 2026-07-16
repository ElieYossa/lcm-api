import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class UserSaving extends Model {
    public id!: string;
    public userId!: string;
    public planId!: string;
    public initialAmount!: number;
    public currentAmount!: number;
    public startDate!: Date;
    public endDate!: Date;
    public status!: 'active' | 'completed' | 'withdrawn_early';
}

UserSaving.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    userId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    planId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    initialAmount: { 
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false 
    },
    currentAmount: { 
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false 
    },
    startDate: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    endDate: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM('active', 'completed', 'withdrawn_early'), 
        defaultValue: 'active' 
    }
}, { 
    sequelize, 
    tableName: 'user_savings', 
    timestamps: true 
});

export default UserSaving;