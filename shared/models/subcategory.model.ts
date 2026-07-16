import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class SubCategory extends Model {
    public id!: string;
    public categoryId!: string;
    public name!: string;
    public description!: string | null;
    public icon!: string | null; 
}

SubCategory.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'sub_categories', 
    timestamps: true 
});

export default SubCategory;