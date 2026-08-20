"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PAID"] = "paid";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    clientId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    shopId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    totalAmount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    platformFee: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    referralFee: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PENDING
    },
    deliveryType: {
        type: sequelize_1.DataTypes.ENUM('pickup', 'delivery'),
        allowNull: false
    },
    shippingAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    otpCode: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    }
}, { sequelize: database_1.default, tableName: 'orders', timestamps: true });
exports.default = Order;
