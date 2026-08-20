"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var CommissionType;
(function (CommissionType) {
    CommissionType["USER_REFERRAL"] = "user_referral";
    CommissionType["SHOP_REFERRAL"] = "shop_referral";
    CommissionType["PLATFORM_FEE"] = "platform_fee";
})(CommissionType || (exports.CommissionType = CommissionType = {}));
class CommissionConfig extends sequelize_1.Model {
}
CommissionConfig.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(CommissionType)),
        allowNull: false,
        unique: true
    },
    percentage: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    tableName: 'commission_configs',
    timestamps: true
});
exports.default = CommissionConfig;
