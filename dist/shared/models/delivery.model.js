"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["ASSIGNED"] = "assigned";
    DeliveryStatus["PICKED_UP"] = "picked_up";
    DeliveryStatus["IN_TRANSIT"] = "in_transit";
    DeliveryStatus["DELIVERED"] = "delivered";
    DeliveryStatus["COMPLETED"] = "completed";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
class Delivery extends sequelize_1.Model {
}
Delivery.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    orderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    driverId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(DeliveryStatus)),
        defaultValue: DeliveryStatus.ASSIGNED
    },
    currentLat: {
        type: sequelize_1.DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    currentLng: {
        type: sequelize_1.DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    pickedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    deliveredAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    tableName: 'deliveries',
    timestamps: true
});
exports.default = Delivery;
