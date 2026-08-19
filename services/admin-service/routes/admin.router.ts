import { Router } from 'express';
import * as AdminController from '../controllers/admin.controller';
import { protect, restrictTo } from '../../../shared/middlewares/auth.middleware';
import { upload } from '../../../shared/utils/uploadConfig';

const AdminRouter = Router();

AdminRouter.get('/categories', AdminController.getCategories);
AdminRouter.get('/categories/:categoryId/sub-categories', AdminController.getSubCategories);


AdminRouter.use(protect);
AdminRouter.use(restrictTo('admin'));


AdminRouter.post('/categories', upload.single('icon'), AdminController.addCategory);
AdminRouter.patch('/categories/:id', upload.single('icon'), AdminController.updateCategory);
AdminRouter.post('/sub-categories', upload.single('icon'), AdminController.addSubCategory);
AdminRouter.patch('/sub-categories/:id', upload.single('icon'), AdminController.updateSubCategory);


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

export default AdminRouter;