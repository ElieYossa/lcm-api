import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Shop } from './index.model';

export enum ProductStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

class Product extends Model {
    public id!: string;
    public shopId!: string | null;
    public categoryId!: string;
    public subCategoryId!: string;
    public name!: string;
    public description!: string;
    public price!: number;
    public stockQuantity!: number;
    public images!: string;
    public isActive!: boolean;
    public status!: ProductStatus;
    public rejectionReason!: string | null;
    public readonly shop?: Shop; 
}

Product.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    shopId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'shops', key: 'id' }
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' }
    },
    subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'sub_categories', key: 'id' }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    status: {
        type: DataTypes.ENUM(...Object.values(ProductStatus)),
        defaultValue: ProductStatus.PENDING
    },
    rejectionReason: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'products',
    timestamps: true
});

export default Product;