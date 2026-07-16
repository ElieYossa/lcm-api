import sequelize from '../config/database';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

// Imports des Modèles
import User, { UserRole } from './users.model';
import Token from './token.model';
import Category from './category.model';
import SubCategory from './subcategory.model';
import Shop, { ShopStatus } from './shop.model';
import Product from './product.model';
import Order from './order.model';
import OrderItem from './oderItem.model';
import Delivery from './delivery.model';
import Wallet from './wallet.model';
import Transaction from './transaction.model';
import Booking from './booking.model';
import ServiceOffer from './serviceoffer.model';
import CommissionConfig from './commissionconfig.model';
import CurrencyBalance from './currencybalance.model';
import SavingsPlan from './savingsplan.model';
import UserSaving from './usersaving.model';

User.hasMany(Token, { foreignKey: 'userId', as: 'sessions' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.belongsTo(User, { as: 'referrer', foreignKey: 'referredBy' });
User.hasMany(User, { as: 'referrals', foreignKey: 'referredBy' });

Category.hasMany(SubCategory, { foreignKey: 'categoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

SubCategory.hasMany(Product, { foreignKey: 'subCategoryId' });
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId' });

User.hasMany(Shop, { foreignKey: 'ownerId', as: 'shops' });
Shop.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Shop.hasMany(Product, { foreignKey: 'shopId', as: 'products' });
Product.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

Shop.hasMany(ServiceOffer, { foreignKey: 'shopId', as: 'services' });
ServiceOffer.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'history' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId' });

Wallet.hasMany(CurrencyBalance, { foreignKey: 'walletId', as: 'balances' });
CurrencyBalance.belongsTo(Wallet, { foreignKey: 'walletId' });

User.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

Shop.hasMany(Order, { foreignKey: 'shopId', as: 'orders' });
Order.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Order.hasOne(Delivery, { foreignKey: 'orderId', as: 'delivery' });
Delivery.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Delivery, { foreignKey: 'driverId', as: 'deliveries' });
Delivery.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

ServiceOffer.hasMany(Booking, { foreignKey: 'serviceOfferId', as: 'bookings' });
Booking.belongsTo(ServiceOffer, { foreignKey: 'serviceOfferId', as: 'service' });

User.hasMany(Booking, { foreignKey: 'clientId', as: 'myBookings' });
Booking.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

SavingsPlan.hasMany(UserSaving, { foreignKey: 'planId', as: 'userSavings' });
UserSaving.belongsTo(SavingsPlan, { foreignKey: 'planId', as: 'plan' });


const seedInitialData = async () => {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@lcm.com';
    const adminExists = await User.findOne({ where: { role: UserRole.ADMIN } });
    if (!adminExists) {
        console.log('--- Seeding Admin ---');
        const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'AdminLcm2024!', 10);
        await User.create({
            firstName: 'System', lastName: 'Admin',
            email: adminEmail, phone: '+243000000000',
            password: hashedPassword, role: UserRole.ADMIN,
            referralCode: 'ADMIN-LCM', isVerified: true, kycStatus: 'approved'
        });
    }

    const plansCount = await SavingsPlan.count();
    if (plansCount === 0) {
        console.log('--- Seeding Savings Plans ---');
        await SavingsPlan.bulkCreate([
            { name: 'Bronze (3 mois)', durationMonths: 3, interestRate: 5, minAmount: 10 },
            { name: 'Or (12 mois)', durationMonths: 12, interestRate: 15, minAmount: 100 }
        ]);
    }

    const configCount = await CommissionConfig.count();
    if (configCount === 0) {
        console.log('--- Seeding Commission Configs ---');
        await CommissionConfig.bulkCreate([
            { type: 'platform_fee', percentage: 10.0, description: 'Part de la plateforme' },
            { type: 'shop_referral', percentage: 3.0, description: 'Commission pour le parrain de la boutique' },
            { type: 'user_referral', percentage: 2.0, description: 'Commission pour le parrain du client' }
        ]);
    }
};


const initModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('All models synchronized successfully.');
        await seedInitialData();
    } catch (error) {
        console.error('Error during database initialization:', error);
    }
};

export { 
    sequelize, 
    User, 
    Token, 
    Category, 
    SubCategory, 
    Shop, 
    Product,
    Order, 
    OrderItem, 
    Delivery, 
    Wallet, 
    Transaction, 
    Booking,
    ServiceOffer, 
    CommissionConfig, 
    CurrencyBalance, 
    SavingsPlan,
    initModels 
};