import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './users.model';

class Token extends Model {
    public id!: string;
    public userId!: string;
    public token!: string;
    public deviceDetail!: string | null;
    public isValid!: boolean;
    public readonly user?: User; 
    public expiresAt!: Date;
}

Token.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    deviceDetail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens',
    timestamps: true,
});

export default Token;