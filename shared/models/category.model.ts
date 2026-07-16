import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Category extends Model {
    public id!: string;
    public name!: string;
    public description!: string | null;
    public icon!: string | null;
}

Category.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, { 
    sequelize, 
    tableName: 'categories', 
    timestamps: true 
});

export default Category;