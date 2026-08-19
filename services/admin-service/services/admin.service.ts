import {
    Category, SubCategory, Shop, Product, ServiceOffer,
    SavingsPlan, CommissionConfig, User, Transaction
} from '../../../shared/models/index.model';
import { ShopStatus } from '../../../shared/models/shop.model';
import { ProductStatus } from '../../../shared/models/product.model';
import { CommissionType } from '../../../shared/models/commissionconfig.model';
import fs from 'fs';
import path from 'path';

export class AdminService {

    static async createCategory(data: any) {
        console.log("Creating category with data:", data);
        return await Category.create(data);
    }

    static async updateCategory(id: string, data: any) {
        const cat = await Category.findByPk(id);
        if (!cat) throw new Error("Catégorie introuvable");
        return await cat.update(data);
    }

    static async updateSubCategory(id: string, data: any) {
        const subCat = await SubCategory.findByPk(id);
        if (!subCat) throw new Error("Sous-catégorie introuvable");

        return await subCat.update(data);
    }

    static async createSubCategory(data: any) {
        return await SubCategory.create(data);
    }

    static async getCategories(page: number = 1) {
        const LIMIT = 8;
        const offset = (page - 1) * LIMIT;

        const { count, rows } = await Category.findAndCountAll({
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

    static async getSubCategoriesByCategoryId(categoryId: string, page: number = 1) {
        const LIMIT = 4;
        const offset = (page - 1) * LIMIT;

        const { count, rows } = await SubCategory.findAndCountAll({
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

    static async deleteCategory(id: string) {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Catégorie introuvable");

        const subCatCount = await SubCategory.count({ where: { categoryId: id } });
        if (subCatCount > 0) {
            throw new Error(`Impossible de supprimer : ${subCatCount} sous-catégorie(s) sont encore liées à cette catégorie.`);
        }

        const productCount = await Product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            throw new Error(`Impossible de supprimer : ${productCount} produit(s) sont encore liés à cette catégorie.`);
        }

        if (category.icon) {
            const filePath = path.join(__dirname, '../../../../', category.icon);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        return await category.destroy();
    }

    static async deleteSubCategory(id: string) {
        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) throw new Error("Sous-catégorie introuvable");

        const productCount = await Product.count({ where: { subCategoryId: id } });
        if (productCount > 0) {
            throw new Error(`Impossible de supprimer : ${productCount} produit(s) utilisent encore cette sous-catégorie.`);
        }

        if (subCategory.icon) {
            const filePath = path.join(__dirname, '../../', subCategory.icon);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        return await subCategory.destroy();
    }

    static async approveShop(shopId: string, status: ShopStatus) {
        const shop = await Shop.findByPk(shopId);
        if (!shop) throw new Error('Boutique introuvable');
        shop.status = status;
        return await shop.save();
    }

    static async approveProduct(productId: string, status: ProductStatus, reason?: string) {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error('Produit introuvable');
        product.status = status;
        if (reason) product.rejectionReason = reason;
        return await product.save();
    }

    static async approveServiceOffer(serviceId: string, status: any, reason?: string) {
        const service = await ServiceOffer.findByPk(serviceId);
        if (!service) throw new Error('Service introuvable');
        service.status = status;
        return await service.save();
    }


    static async getAllUsers(role?: string) {
        const where = role ? { role } : {};
        return await User.findAll({ where, attributes: { exclude: ['password'] } });
    }

    static async approveUserKYC(userId: string, status: 'approved' | 'rejected') {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("Utilisateur introuvable");
        user.kycStatus = status;
        return await user.save();
    }

    static async setCommissionConfig(type: CommissionType, percentage: number, description?: string) {
        const [config, created] = await CommissionConfig.findOrCreate({
            where: { type },
            defaults: { percentage, description, isActive: true }
        });

        if (!created) {
            config.percentage = percentage;
            if (description) config.description = description;
            await config.save();
        }
        return config;
    }

    static async getCommissionConfigs() {
        return await CommissionConfig.findAll();
    }


    static async createSavingsPlan(data: any) {
        return await SavingsPlan.create(data);
    }

    static async updateSavingsPlan(planId: string, data: any) {
        const plan = await SavingsPlan.findByPk(planId);
        if (!plan) throw new Error("Plan d'épargne introuvable");
        return await plan.update(data);
    }

    static async deleteSavingsPlan(planId: string) {
        const plan = await SavingsPlan.findByPk(planId);
        if (!plan) throw new Error("Plan d'épargne introuvable");
        return await plan.destroy();
    }

    static async getAllPlans() {
        return await SavingsPlan.findAll();
    }

    static async getPendingWithdrawals() {
        return await Transaction.findAll({
            where: { type: 'withdrawal', status: 'pending' },
            include: ['wallet']
        });
    }

    static async validateWithdrawal(transactionId: string, status: 'completed' | 'failed') {
        const trx = await Transaction.findByPk(transactionId);
        if (!trx) throw new Error("Demande de retrait introuvable");
        trx.status = status;
        return await trx.save();
    }

    private static readonly LIMIT = 8;

    static async getPendingShops(page: number = 1) {
        const offset = (page - 1) * this.LIMIT;

        const { count, rows } = await Shop.findAndCountAll({
            where: { status: ShopStatus.PENDING },
            limit: this.LIMIT,
            offset: offset,
            distinct: true, 
            include: [{ 
                model: User, 
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

    static async getPendingProducts(page: number = 1) {
        const offset = (page - 1) * this.LIMIT;

        const { count, rows } = await Product.findAndCountAll({
            where: { status: ProductStatus.PENDING },
            limit: this.LIMIT,
            offset: offset,
            distinct: true,
            include: [
                {
                    model: Shop,
                    as: 'shop',
                    include: [{ model: User, as: 'owner', attributes: { exclude: ['password'] } }]
                },
                { model: Category },
                { model: SubCategory }
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

    static async getPendingServices(page: number = 1) {
        const offset = (page - 1) * this.LIMIT;

        const { count, rows } = await ServiceOffer.findAndCountAll({
            where: { status: 'pending' },
            limit: this.LIMIT,
            offset: offset,
            distinct: true,
            include: [
                {
                    model: Shop,
                    as: 'shop',
                    include: [{ model: User, as: 'owner', attributes: { exclude: ['password'] } }]
                },
                { model: Category }
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