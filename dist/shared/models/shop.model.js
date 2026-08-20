"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var ShopStatus;
(function (ShopStatus) {
    ShopStatus["PENDING"] = "pending";
    ShopStatus["APPROVED"] = "approved";
    ShopStatus["REJECTED"] = "rejected";
    ShopStatus["SUSPENDED"] = "suspended";
})(ShopStatus || (exports.ShopStatus = ShopStatus = {}));
class Shop extends sequelize_1.Model {
}
Shop.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    ownerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: sequelize_1.DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: sequelize_1.DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ShopStatus)),
        defaultValue: ShopStatus.PENDING
    },
    logo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    documents: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    referredBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' }
    }
}, {
    sequelize: database_1.default,
    tableName: 'shops',
    timestamps: true
});
exports.default = Shop;
