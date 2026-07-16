import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class OrderItem extends Model {
    public id!: string;
    public orderId!: string;
    public productId!: string;
    public quantity!: number;
    public priceAtPurchase!: number;
}

OrderItem.init({
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    orderId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    productId: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    priceAtPurchase: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    }
}, { 
    sequelize, 
    tableName: 'order_items', 
    timestamps: true 
});

export default OrderItem;