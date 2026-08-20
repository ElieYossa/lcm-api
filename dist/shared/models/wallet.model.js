"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Wallet extends sequelize_1.Model {
}
Wallet.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false, unique: true
    },
    balance: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    savingsBalance: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'USD'
    }
}, {
    sequelize: database_1.default,
    tableName: 'wallets',
    timestamps: true
});
exports.default = Wallet;
