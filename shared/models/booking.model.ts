import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

class Booking extends Model {
    public id!: string;
    public clientId!: string;
    public serviceOfferId!: string;
    public startDate!: Date;
    public endDate!: Date | null;
    public status!: BookingStatus;
    public depositPaid!: number;
    public otpCode!: string;
}

Booking.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    clientId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    serviceOfferId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    startDate: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    endDate: { 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    status: { 
        type: DataTypes.ENUM(...Object.values(BookingStatus)), 
        defaultValue: BookingStatus.PENDING 
    },
    depositPaid: { 
        type: DataTypes.DECIMAL(10, 2), 
        defaultValue: 0 
    },
    otpCode: { 
        type: DataTypes.STRING(6), 
        allowNull: false 
    }
}, { 
    sequelize, 
    tableName: 'bookings', 
    timestamps: true 
});

export default Booking;