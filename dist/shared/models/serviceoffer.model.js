"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var ServiceType;
(function (ServiceType) {
    ServiceType["GENERAL"] = "general";
    ServiceType["HOTEL"] = "hotel";
    ServiceType["RESTAURANT"] = "restaurant";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
class ServiceOffer extends sequelize_1.Model {
}
ServiceOffer.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    shopId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ServiceType)),
        defaultValue: ServiceType.GENERAL
    },
    totalPrice: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    depositAmount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    features: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
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
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'pending'
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    tableName: 'service_offers',
    timestamps: true
});
exports.default = ServiceOffer;
