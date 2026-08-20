"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["PAYMENT"] = "payment";
    TransactionType["COMMISSION"] = "commission";
    TransactionType["TRANSFER"] = "transfer";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
class Transaction extends sequelize_1.Model {
}
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    walletId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(TransactionType)),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'completed'
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    tableName: 'transactions',
    timestamps: true
});
exports.default = Transaction;
