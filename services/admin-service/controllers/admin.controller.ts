import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendResponse } from '../../../shared/utils/responseHandler';
import { UUID } from 'node:crypto';


export const addCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        const category = await AdminService.createCategory(data);
        return sendResponse(res, 201, true, "Catégorie créée avec succès", category);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        const categoryId = req.params.id as string;
        if (!categoryId) {
            return sendResponse(res, 400, false, "ID de catégorie requis");
        }
        const category = await AdminService.updateCategory(categoryId, data);
        return sendResponse(res, 200, true, "Catégorie mise à jour", category);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const updateSubCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }

        const subCategoryId = req.params.id as string;
        if (!subCategoryId) {
            return sendResponse(res, 400, false, "ID de sous-catégorie requis");
        }
        const subCategory = await AdminService.updateSubCategory(subCategoryId, data);
        
        return sendResponse(res, 200, true, "Sous-catégorie mise à jour avec succès", subCategory);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const addSubCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        if (!data.categoryId) {
            return sendResponse(res, 400, false, "L'identifiant de la catégorie parente (categoryId) est requis");
        }

        const subCat = await AdminService.createSubCategory(data);
        return sendResponse(res, 201, true, "Sous-catégorie créée avec succès", subCat);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const result = await AdminService.getCategories(page);
        return sendResponse(res, 200, true, "Catégories récupérées (8 par page)", result);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getSubCategories = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId as string;
        const page = parseInt(req.query.page as string) || 1;

        if (!categoryId) throw new Error("L'ID de la catégorie est requis");

        const result = await AdminService.getSubCategoriesByCategoryId(categoryId, page);
        return sendResponse(res, 200, true, "Sous-catégories récupérées (4 par page)", result);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id) return sendResponse(res, 400, false, "ID requis");

        await AdminService.deleteCategory(id);
        
        return sendResponse(res, 200, true, "Catégorie supprimée avec succès");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id) return sendResponse(res, 400, false, "ID requis");

        await AdminService.deleteSubCategory(id);
        
        return sendResponse(res, 200, true, "Sous-catégorie supprimée avec succès");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const validateShop = async (req: Request, res: Response) => {
    try {
        const { shopId, status } = req.body;
        const shop = await AdminService.approveShop(shopId, status);
        return sendResponse(res, 200, true, `Boutique mise à jour au statut : ${status}`, shop);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const validateProduct = async (req: Request, res: Response) => {
    try {
        const { productId, status, reason } = req.body;
        const product = await AdminService.approveProduct(productId, status, reason);
        return sendResponse(res, 200, true, `Produit mis à jour au statut : ${status}`, product);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const validateService = async (req: Request, res: Response) => {
    try {
        const { serviceId, status, reason } = req.body;
        const service = await AdminService.approveServiceOffer(serviceId, status, reason);
        return sendResponse(res, 200, true, `Prestation de service mise à jour : ${status}`, service);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const getUsers = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;
        const users = await AdminService.getAllUsers(role as string);
        return sendResponse(res, 200, true, "Liste des utilisateurs récupérée", users);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const validateKYC = async (req: Request, res: Response) => {
    try {
        const { userId, status } = req.body;
        const user = await AdminService.approveUserKYC(userId, status);
        return sendResponse(res, 200, true, `Statut KYC utilisateur mis à jour : ${status}`, user);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const setCommissionConfig = async (req: Request, res: Response) => {
    try {
        const { type, percentage, description } = req.body;
        const config = await AdminService.setCommissionConfig(type, percentage, description);
        return sendResponse(res, 200, true, "Configuration commission mise à jour", config);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getCommissionConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await AdminService.getCommissionConfigs();
        return sendResponse(res, 200, true, "Règles de commissions récupérées", configs);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const createSavingsPlan = async (req: Request, res: Response) => {
    try {
        const plan = await AdminService.createSavingsPlan(req.body);
        return sendResponse(res, 201, true, "Nouveau plan d'épargne créé", plan);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const updateSavingsPlan = async (req: Request, res: Response) => {
    try {
        const plan = await AdminService.updateSavingsPlan(req.params.id as string, req.body);
        return sendResponse(res, 200, true, "Plan d'épargne mis à jour", plan);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const deleteSavingsPlan = async (req: Request, res: Response) => {
    try {
        await AdminService.deleteSavingsPlan(req.params.id as string);
        return sendResponse(res, 200, true, "Plan d'épargne supprimé");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getSavingsPlans = async (req: Request, res: Response) => {
    try {
        const plans = await AdminService.getAllPlans();
        return sendResponse(res, 200, true, "Liste des plans récupérée", plans);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const getWithdrawalRequests = async (req: Request, res: Response) => {
    try {
        const requests = await AdminService.getPendingWithdrawals();
        return sendResponse(res, 200, true, "Demandes de retraits en attente", requests);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const processWithdrawal = async (req: Request, res: Response) => {
    try {
        const { transactionId, status } = req.body;
        const result = await AdminService.validateWithdrawal(transactionId, status);
        return sendResponse(res, 200, true, `Le retrait a été marqué comme : ${status}`, result);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};