"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["PENDING"] = "pending";
    ProductStatus["APPROVED"] = "approved";
    ProductStatus["REJECTED"] = "rejected";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    shopId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: { model: 'shops', key: 'id' }
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' }
    },
    subCategoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'sub_categories', key: 'id' }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stockQuantity: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    images: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ProductStatus)),
        defaultValue: ProductStatus.PENDING
    },
    rejectionReason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    tableName: 'products',
    timestamps: true
});
exports.default = Product;
