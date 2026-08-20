"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingServices = exports.getPendingProducts = exports.getPendingShops = exports.processWithdrawal = exports.getWithdrawalRequests = exports.getSavingsPlans = exports.deleteSavingsPlan = exports.updateSavingsPlan = exports.createSavingsPlan = exports.getCommissionConfigs = exports.setCommissionConfig = exports.validateKYC = exports.getUsers = exports.validateService = exports.validateProduct = exports.validateShop = exports.deleteSubCategory = exports.deleteCategory = exports.getSubCategories = exports.getCategories = exports.addSubCategory = exports.updateSubCategory = exports.updateCategory = exports.addCategory = void 0;
const admin_service_1 = require("../services/admin.service");
const responseHandler_1 = require("../../../shared/utils/responseHandler");
const addCategory = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        const category = await admin_service_1.AdminService.createCategory(data);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Catégorie créée avec succès", category);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.addCategory = addCategory;
const updateCategory = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        const categoryId = req.params.id;
        if (!categoryId) {
            return (0, responseHandler_1.sendResponse)(res, 400, false, "ID de catégorie requis");
        }
        const category = await admin_service_1.AdminService.updateCategory(categoryId, data);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Catégorie mise à jour", category);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.updateCategory = updateCategory;
const updateSubCategory = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        const subCategoryId = req.params.id;
        if (!subCategoryId) {
            return (0, responseHandler_1.sendResponse)(res, 400, false, "ID de sous-catégorie requis");
        }
        const subCategory = await admin_service_1.AdminService.updateSubCategory(subCategoryId, data);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Sous-catégorie mise à jour avec succès", subCategory);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.updateSubCategory = updateSubCategory;
const addSubCategory = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        if (!data.categoryId) {
            return (0, responseHandler_1.sendResponse)(res, 400, false, "L'identifiant de la catégorie parente (categoryId) est requis");
        }
        const subCat = await admin_service_1.AdminService.createSubCategory(data);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Sous-catégorie créée avec succès", subCat);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.addSubCategory = addSubCategory;
const getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await admin_service_1.AdminService.getCategories(page);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Catégories récupérées (8 par page)", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getCategories = getCategories;
const getSubCategories = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const page = parseInt(req.query.page) || 1;
        if (!categoryId)
            throw new Error("L'ID de la catégorie est requis");
        const result = await admin_service_1.AdminService.getSubCategoriesByCategoryId(categoryId, page);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Sous-catégories récupérées (4 par page)", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getSubCategories = getSubCategories;
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return (0, responseHandler_1.sendResponse)(res, 400, false, "ID requis");
        await admin_service_1.AdminService.deleteCategory(id);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Catégorie supprimée avec succès");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.deleteCategory = deleteCategory;
const deleteSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return (0, responseHandler_1.sendResponse)(res, 400, false, "ID requis");
        await admin_service_1.AdminService.deleteSubCategory(id);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Sous-catégorie supprimée avec succès");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.deleteSubCategory = deleteSubCategory;
const validateShop = async (req, res) => {
    try {
        const { id, status } = req.body;
        const shop = await admin_service_1.AdminService.approveShop(id, status);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `Boutique mise à jour au statut : ${status}`, shop);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.validateShop = validateShop;
const validateProduct = async (req, res) => {
    try {
        const { id, status, reason } = req.body;
        const product = await admin_service_1.AdminService.approveProduct(id, status, reason);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `Produit mis à jour au statut : ${status}`, product);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.validateProduct = validateProduct;
const validateService = async (req, res) => {
    try {
        const { id, status, reason } = req.body;
        const service = await admin_service_1.AdminService.approveServiceOffer(id, status, reason);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `Prestation de service mise à jour : ${status}`, service);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.validateService = validateService;
const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const users = await admin_service_1.AdminService.getAllUsers(role);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Liste des utilisateurs récupérée", users);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getUsers = getUsers;
const validateKYC = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const user = await admin_service_1.AdminService.approveUserKYC(userId, status);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `Statut KYC utilisateur mis à jour : ${status}`, user);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.validateKYC = validateKYC;
const setCommissionConfig = async (req, res) => {
    try {
        const { type, percentage, description } = req.body;
        const config = await admin_service_1.AdminService.setCommissionConfig(type, percentage, description);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Configuration commission mise à jour", config);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.setCommissionConfig = setCommissionConfig;
const getCommissionConfigs = async (req, res) => {
    try {
        const configs = await admin_service_1.AdminService.getCommissionConfigs();
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Règles de commissions récupérées", configs);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getCommissionConfigs = getCommissionConfigs;
const createSavingsPlan = async (req, res) => {
    try {
        const plan = await admin_service_1.AdminService.createSavingsPlan(req.body);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Nouveau plan d'épargne créé", plan);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.createSavingsPlan = createSavingsPlan;
const updateSavingsPlan = async (req, res) => {
    try {
        const plan = await admin_service_1.AdminService.updateSavingsPlan(req.params.id, req.body);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Plan d'épargne mis à jour", plan);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.updateSavingsPlan = updateSavingsPlan;
const deleteSavingsPlan = async (req, res) => {
    try {
        await admin_service_1.AdminService.deleteSavingsPlan(req.params.id);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Plan d'épargne supprimé");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.deleteSavingsPlan = deleteSavingsPlan;
const getSavingsPlans = async (req, res) => {
    try {
        const plans = await admin_service_1.AdminService.getAllPlans();
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Liste des plans récupérée", plans);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getSavingsPlans = getSavingsPlans;
const getWithdrawalRequests = async (req, res) => {
    try {
        const requests = await admin_service_1.AdminService.getPendingWithdrawals();
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Demandes de retraits en attente", requests);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getWithdrawalRequests = getWithdrawalRequests;
const processWithdrawal = async (req, res) => {
    try {
        const { transactionId, status } = req.body;
        const result = await admin_service_1.AdminService.validateWithdrawal(transactionId, status);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `Le retrait a été marqué comme : ${status}`, result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.processWithdrawal = processWithdrawal;
const getPendingShops = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await admin_service_1.AdminService.getPendingShops(page);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Boutiques en attente récupérées", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getPendingShops = getPendingShops;
const getPendingProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await admin_service_1.AdminService.getPendingProducts(page);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Produits en attente récupérés", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getPendingProducts = getPendingProducts;
const getPendingServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await admin_service_1.AdminService.getPendingServices(page);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Services en attente récupérés", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getPendingServices = getPendingServices;
