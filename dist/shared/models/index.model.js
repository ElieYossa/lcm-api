"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModels = exports.SavingsPlan = exports.CurrencyBalance = exports.CommissionConfig = exports.ServiceOffer = exports.Booking = exports.Transaction = exports.Wallet = exports.Delivery = exports.OrderItem = exports.Order = exports.Product = exports.Shop = exports.SubCategory = exports.Category = exports.Token = exports.User = exports.sequelize = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Imports des Modèles
const users_model_1 = __importStar(require("./users.model"));
exports.User = users_model_1.default;
const token_model_1 = __importDefault(require("./token.model"));
exports.Token = token_model_1.default;
const category_model_1 = __importDefault(require("./category.model"));
exports.Category = category_model_1.default;
const subcategory_model_1 = __importDefault(require("./subcategory.model"));
exports.SubCategory = subcategory_model_1.default;
const shop_model_1 = __importDefault(require("./shop.model"));
exports.Shop = shop_model_1.default;
const product_model_1 = __importDefault(require("./product.model"));
exports.Product = product_model_1.default;
const order_model_1 = __importDefault(require("./order.model"));
exports.Order = order_model_1.default;
const oderItem_model_1 = __importDefault(require("./oderItem.model"));
exports.OrderItem = oderItem_model_1.default;
const delivery_model_1 = __importDefault(require("./delivery.model"));
exports.Delivery = delivery_model_1.default;
const wallet_model_1 = __importDefault(require("./wallet.model"));
exports.Wallet = wallet_model_1.default;
const transaction_model_1 = __importDefault(require("./transaction.model"));
exports.Transaction = transaction_model_1.default;
const booking_model_1 = __importDefault(require("./booking.model"));
exports.Booking = booking_model_1.default;
const serviceoffer_model_1 = __importDefault(require("./serviceoffer.model"));
exports.ServiceOffer = serviceoffer_model_1.default;
const commissionconfig_model_1 = __importDefault(require("./commissionconfig.model"));
exports.CommissionConfig = commissionconfig_model_1.default;
const currencybalance_model_1 = __importDefault(require("./currencybalance.model"));
exports.CurrencyBalance = currencybalance_model_1.default;
const savingsplan_model_1 = __importDefault(require("./savingsplan.model"));
exports.SavingsPlan = savingsplan_model_1.default;
const usersaving_model_1 = __importDefault(require("./usersaving.model"));
users_model_1.default.hasMany(token_model_1.default, { foreignKey: 'userId', as: 'sessions' });
token_model_1.default.belongsTo(users_model_1.default, { foreignKey: 'userId', as: 'user' });
users_model_1.default.belongsTo(users_model_1.default, { as: 'referrer', foreignKey: 'referredBy' });
users_model_1.default.hasMany(users_model_1.default, { as: 'referrals', foreignKey: 'referredBy' });
category_model_1.default.hasMany(subcategory_model_1.default, { foreignKey: 'categoryId', as: 'subCategories' });
subcategory_model_1.default.belongsTo(category_model_1.default, { foreignKey: 'categoryId', as: 'category' });
category_model_1.default.hasMany(product_model_1.default, { foreignKey: 'categoryId' });
product_model_1.default.belongsTo(category_model_1.default, { foreignKey: 'categoryId' });
subcategory_model_1.default.hasMany(product_model_1.default, { foreignKey: 'subCategoryId' });
product_model_1.default.belongsTo(subcategory_model_1.default, { foreignKey: 'subCategoryId' });
users_model_1.default.hasMany(shop_model_1.default, { foreignKey: 'ownerId', as: 'shops' });
shop_model_1.default.belongsTo(users_model_1.default, { foreignKey: 'ownerId', as: 'owner' });
shop_model_1.default.hasMany(product_model_1.default, { foreignKey: 'shopId', as: 'products' });
product_model_1.default.belongsTo(shop_model_1.default, { foreignKey: 'shopId', as: 'shop' });
shop_model_1.default.hasMany(serviceoffer_model_1.default, { foreignKey: 'shopId', as: 'services' });
serviceoffer_model_1.default.belongsTo(shop_model_1.default, { foreignKey: 'shopId', as: 'shop' });
users_model_1.default.hasOne(wallet_model_1.default, { foreignKey: 'userId', as: 'wallet' });
wallet_model_1.default.belongsTo(users_model_1.default, { foreignKey: 'userId' });
wallet_model_1.default.hasMany(transaction_model_1.default, { foreignKey: 'walletId', as: 'history' });
transaction_model_1.default.belongsTo(wallet_model_1.default, { foreignKey: 'walletId' });
wallet_model_1.default.hasMany(currencybalance_model_1.default, { foreignKey: 'walletId', as: 'balances' });
currencybalance_model_1.default.belongsTo(wallet_model_1.default, { foreignKey: 'walletId' });
users_model_1.default.hasMany(order_model_1.default, { foreignKey: 'clientId', as: 'orders' });
order_model_1.default.belongsTo(users_model_1.default, { foreignKey: 'clientId', as: 'client' });
shop_model_1.default.hasMany(order_model_1.default, { foreignKey: 'shopId', as: 'orders' });
order_model_1.default.belongsTo(shop_model_1.default, { foreignKey: 'shopId', as: 'shop' });
order_model_1.default.hasMany(oderItem_model_1.default, { foreignKey: 'orderId', as: 'items' });
oderItem_model_1.default.belongsTo(order_model_1.default, { foreignKey: 'orderId' });
oderItem_model_1.default.belongsTo(product_model_1.default, { foreignKey: 'productId', as: 'product' });
order_model_1.default.hasOne(delivery_model_1.default, { foreignKey: 'orderId', as: 'delivery' });
delivery_model_1.default.belongsTo(order_model_1.default, { foreignKey: 'orderId' });
users_model_1.default.hasMany(delivery_model_1.default, { foreignKey: 'driverId', as: 'deliveries' });
delivery_model_1.default.belongsTo(users_model_1.default, { foreignKey: 'driverId', as: 'driver' });
serviceoffer_model_1.default.hasMany(booking_model_1.default, { foreignKey: 'serviceOfferId', as: 'bookings' });
booking_model_1.default.belongsTo(serviceoffer_model_1.default, { foreignKey: 'serviceOfferId', as: 'service' });
users_model_1.default.hasMany(booking_model_1.default, { foreignKey: 'clientId', as: 'myBookings' });
booking_model_1.default.belongsTo(users_model_1.default, { foreignKey: 'clientId', as: 'client' });
savingsplan_model_1.default.hasMany(usersaving_model_1.default, { foreignKey: 'planId', as: 'userSavings' });
usersaving_model_1.default.belongsTo(savingsplan_model_1.default, { foreignKey: 'planId', as: 'plan' });
const seedInitialData = async () => {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@lcm.com';
    const adminExists = await users_model_1.default.findOne({ where: { role: users_model_1.UserRole.ADMIN } });
    if (!adminExists) {
        console.log('--- Seeding Admin ---');
        const hashedPassword = await bcrypt_1.default.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'AdminLcm2024!', 10);
        await users_model_1.default.create({
            firstName: 'System', lastName: 'Admin',
            email: adminEmail, phone: '+243000000000',
            password: hashedPassword, role: users_model_1.UserRole.ADMIN,
            referralCode: 'ADMIN-LCM', isVerified: true, kycStatus: 'approved'
        });
    }
    const plansCount = await savingsplan_model_1.default.count();
    if (plansCount === 0) {
        console.log('--- Seeding Savings Plans ---');
        await savingsplan_model_1.default.bulkCreate([
            { name: 'Bronze (3 mois)', durationMonths: 3, interestRate: 5, minAmount: 10 },
            { name: 'Or (12 mois)', durationMonths: 12, interestRate: 15, minAmount: 100 }
        ]);
    }
    const configCount = await commissionconfig_model_1.default.count();
    if (configCount === 0) {
        console.log('--- Seeding Commission Configs ---');
        await commissionconfig_model_1.default.bulkCreate([
            { type: 'platform_fee', percentage: 10.0, description: 'Part de la plateforme' },
            { type: 'shop_referral', percentage: 3.0, description: 'Commission pour le parrain de la boutique' },
            { type: 'user_referral', percentage: 2.0, description: 'Commission pour le parrain du client' }
        ]);
    }
};
const initModels = async () => {
    try {
        await database_1.default.sync({ alter: true });
        console.log('All models synchronized successfully.');
        await seedInitialData();
    }
    catch (error) {
        console.error('Error during database initialization:', error);
    }
};
exports.initModels = initModels;
