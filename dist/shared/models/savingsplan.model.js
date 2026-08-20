"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class SavingsPlan extends sequelize_1.Model {
}
SavingsPlan.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    durationMonths: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    interestRate: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    minAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    }
}, {
    sequelize: database_1.default,
    tableName: 'savings_plans',
    timestamps: true
});
exports.default = SavingsPlan;
