"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class UserSaving extends sequelize_1.Model {
}
UserSaving.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    planId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    initialAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    currentAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'completed', 'withdrawn_early'),
        defaultValue: 'active'
    }
}, {
    sequelize: database_1.default,
    tableName: 'user_savings',
    timestamps: true
});
exports.default = UserSaving;
