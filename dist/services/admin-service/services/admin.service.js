"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const index_model_1 = require("../../../shared/models/index.model");
const shop_model_1 = require("../../../shared/models/shop.model");
const product_model_1 = require("../../../shared/models/product.model");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AdminService {
    static async createCategory(data) {
        console.log("Creating category with data:", data);
        return await index_model_1.Category.create(data);
    }
    static async updateCategory(id, data) {
        const cat = await index_model_1.Category.findByPk(id);
        if (!cat)
            throw new Error("Catégorie introuvable");
        return await cat.update(data);
    }
    static async updateSubCategory(id, data) {
        const subCat = await index_model_1.SubCategory.findByPk(id);
        if (!subCat)
            throw new Error("Sous-catégorie introuvable");
        return await subCat.update(data);
    }
    static async createSubCategory(data) {
        return await index_model_1.SubCategory.create(data);
    }
    static async getCategories(page = 1) {
        const LIMIT = 8;
        const offset = (page - 1) * LIMIT;
        const { count, rows } = await index_model_1.Category.findAndCountAll({
            limit: LIMIT,
            offset: offset,
            order: [['name', 'ASC']]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / LIMIT),
            currentPage: page,
            categories: rows
        };
    }
    static async getSubCategoriesByCategoryId(categoryId, page = 1) {
        const LIMIT = 4;
        const offset = (page - 1) * LIMIT;
        const { count, rows } = await index_model_1.SubCategory.findAndCountAll({
            where: { categoryId },
            limit: LIMIT,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / LIMIT),
            currentPage: page,
            subCategories: rows
        };
    }
    static async deleteCategory(id) {
        const category = await index_model_1.Category.findByPk(id);
        if (!category)
            throw new Error("Catégorie introuvable");
        const subCatCount = await index_model_1.SubCategory.count({ where: { categoryId: id } });
        if (subCatCount > 0) {
            throw new Error(`Impossible de supprimer : ${subCatCount} sous-catégorie(s) sont encore liées à cette catégorie.`);
        }
        const productCount = await index_model_1.Product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            throw new Error(`Impossible de supprimer : ${productCount} produit(s) sont encore liés à cette catégorie.`);
        }
        if (category.icon) {
            const filePath = path_1.default.join(__dirname, '../../../../', category.icon);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        return await category.destroy();
    }
    static async deleteSubCategory(id) {
        const subCategory = await index_model_1.SubCategory.findByPk(id);
        if (!subCategory)
            throw new Error("Sous-catégorie introuvable");
        const productCount = await index_model_1.Product.count({ where: { subCategoryId: id } });
        if (productCount > 0) {
            throw new Error(`Impossible de supprimer : ${productCount} produit(s) utilisent encore cette sous-catégorie.`);
        }
        if (subCategory.icon) {
            const filePath = path_1.default.join(__dirname, '../../', subCategory.icon);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        return await subCategory.destroy();
    }
    static async approveShop(shopId, status) {
        const shop = await index_model_1.Shop.findByPk(shopId);
        if (!shop)
            throw new Error('Boutique introuvable');
        shop.status = status;
        return await shop.save();
    }
    static async approveProduct(productId, status, reason) {
        const product = await index_model_1.Product.findByPk(productId);
        if (!product)
            throw new Error('Produit introuvable');
        product.status = status;
        if (reason)
            product.rejectionReason = reason;
        return await product.save();
    }
    static async approveServiceOffer(serviceId, status, reason) {
        const service = await index_model_1.ServiceOffer.findByPk(serviceId);
        if (!service)
            throw new Error('Service introuvable');
        service.status = status;
        return await service.save();
    }
    static async getAllUsers(role) {
        const where = role ? { role } : {};
        return await index_model_1.User.findAll({ where, attributes: { exclude: ['password'] } });
    }
    static async approveUserKYC(userId, status) {
        const user = await index_model_1.User.findByPk(userId);
        if (!user)
            throw new Error("Utilisateur introuvable");
        user.kycStatus = status;
        return await user.save();
    }
    static async setCommissionConfig(type, percentage, description) {
        const [config, created] = await index_model_1.CommissionConfig.findOrCreate({
            where: { type },
            defaults: { percentage, description, isActive: true }
        });
        if (!created) {
            config.percentage = percentage;
            if (description)
                config.description = description;
            await config.save();
        }
        return config;
    }
    static async getCommissionConfigs() {
        return await index_model_1.CommissionConfig.findAll();
    }
    static async createSavingsPlan(data) {
        return await index_model_1.SavingsPlan.create(data);
    }
    static async updateSavingsPlan(planId, data) {
        const plan = await index_model_1.SavingsPlan.findByPk(planId);
        if (!plan)
            throw new Error("Plan d'épargne introuvable");
        return await plan.update(data);
    }
    static async deleteSavingsPlan(planId) {
        const plan = await index_model_1.SavingsPlan.findByPk(planId);
        if (!plan)
            throw new Error("Plan d'épargne introuvable");
        return await plan.destroy();
    }
    static async getAllPlans() {
        return await index_model_1.SavingsPlan.findAll();
    }
    static async getPendingWithdrawals() {
        return await index_model_1.Transaction.findAll({
            where: { type: 'withdrawal', status: 'pending' },
            include: ['wallet']
        });
    }
    static async validateWithdrawal(transactionId, status) {
        const trx = await index_model_1.Transaction.findByPk(transactionId);
        if (!trx)
            throw new Error("Demande de retrait introuvable");
        trx.status = status;
        return await trx.save();
    }
    static async getPendingShops(page = 1) {
        const offset = (page - 1) * this.LIMIT;
        const { count, rows } = await index_model_1.Shop.findAndCountAll({
            where: { status: shop_model_1.ShopStatus.PENDING },
            limit: this.LIMIT,
            offset: offset,
            distinct: true,
            include: [{
                    model: index_model_1.User,
                    as: 'owner',
                    attributes: { exclude: ['password'] }
                }],
            order: [['createdAt', 'DESC']]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / this.LIMIT),
            currentPage: page,
            items: rows
        };
    }
    static async getPendingProducts(page = 1) {
        const offset = (page - 1) * this.LIMIT;
        const { count, rows } = await index_model_1.Product.findAndCountAll({
            where: { status: product_model_1.ProductStatus.PENDING },
            limit: this.LIMIT,
            offset: offset,
            distinct: true,
            include: [
                {
                    model: index_model_1.Shop,
                    as: 'shop',
                    include: [{ model: index_model_1.User, as: 'owner', attributes: { exclude: ['password'] } }]
                },
                { model: index_model_1.Category },
                { model: index_model_1.SubCategory }
            ],
            order: [['createdAt', 'DESC']]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / this.LIMIT),
            currentPage: page,
            items: rows
        };
    }
    static async getPendingServices(page = 1) {
        const offset = (page - 1) * this.LIMIT;
        const { count, rows } = await index_model_1.ServiceOffer.findAndCountAll({
            where: { status: 'pending' },
            limit: this.LIMIT,
            offset: offset,
            distinct: true,
            include: [
                {
                    model: index_model_1.Shop,
                    as: 'shop',
                    include: [{ model: index_model_1.User, as: 'owner', attributes: { exclude: ['password'] } }]
                },
                { model: index_model_1.Category }
            ],
            order: [['createdAt', 'DESC']]
        });
        return {
            totalItems: count,
            totalPages: Math.ceil(count / this.LIMIT),
            currentPage: page,
            items: rows
        };
    }
}
exports.AdminService = AdminService;
AdminService.LIMIT = 8;
