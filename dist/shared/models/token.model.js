"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Token extends sequelize_1.Model {
}
Token.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    deviceDetail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isValid: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Token',
    tableName: 'tokens',
    timestamps: true,
});
exports.default = Token;
