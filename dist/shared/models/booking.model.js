"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
class Booking extends sequelize_1.Model {
}
Booking.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    clientId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    serviceOfferId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(BookingStatus)),
        defaultValue: BookingStatus.PENDING
    },
    depositPaid: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    otpCode: {
        type: sequelize_1.DataTypes.STRING(6),
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    tableName: 'bookings',
    timestamps: true
});
exports.default = Booking;
