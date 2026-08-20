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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController = __importStar(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../../../shared/middlewares/auth.middleware");
const uploadConfig_1 = require("../../../shared/utils/uploadConfig");
const AdminRouter = (0, express_1.Router)();
AdminRouter.get('/categories', AdminController.getCategories);
AdminRouter.get('/categories/:categoryId/sub-categories', AdminController.getSubCategories);
AdminRouter.use(auth_middleware_1.protect);
AdminRouter.use((0, auth_middleware_1.restrictTo)('admin'));
AdminRouter.post('/categories', uploadConfig_1.upload.single('icon'), AdminController.addCategory);
AdminRouter.patch('/categories/:id', uploadConfig_1.upload.single('icon'), AdminController.updateCategory);
AdminRouter.post('/sub-categories', uploadConfig_1.upload.single('icon'), AdminController.addSubCategory);
AdminRouter.patch('/sub-categories/:id', uploadConfig_1.upload.single('icon'), AdminController.updateSubCategory);
AdminRouter.delete('/categories/:id', AdminController.deleteCategory);
AdminRouter.delete('/sub-categories/:id', AdminController.deleteSubCategory);
AdminRouter.patch('/validate-shop', AdminController.validateShop);
AdminRouter.patch('/validate-product', AdminController.validateProduct);
AdminRouter.patch('/validate-service', AdminController.validateService);
AdminRouter.get('/users', AdminController.getUsers);
AdminRouter.patch('/validate-kyc', AdminController.validateKYC);
AdminRouter.get('/commissions/config', AdminController.getCommissionConfigs);
AdminRouter.post('/commissions/config', AdminController.setCommissionConfig);
AdminRouter.get('/savings-plans', AdminController.getSavingsPlans);
AdminRouter.post('/savings-plans', AdminController.createSavingsPlan);
AdminRouter.patch('/savings-plans/:id', AdminController.updateSavingsPlan);
AdminRouter.delete('/savings-plans/:id', AdminController.deleteSavingsPlan);
AdminRouter.get('/withdrawals', AdminController.getWithdrawalRequests);
AdminRouter.patch('/process-withdrawal', AdminController.processWithdrawal);
AdminRouter.get('/pending-shops', AdminController.getPendingShops);
AdminRouter.get('/pending-products', AdminController.getPendingProducts);
AdminRouter.get('/pending-services', AdminController.getPendingServices);
exports.default = AdminRouter;
