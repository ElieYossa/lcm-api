"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class CurrencyBalance extends sequelize_1.Model {
}
CurrencyBalance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    walletId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(18, 8),
        defaultValue: 0.00000000
    }
}, {
    sequelize: database_1.default,
    tableName: 'currency_balances'
});
exports.default = CurrencyBalance;
