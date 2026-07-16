import { Router } from 'express';
import * as BankCtrl from '../controllers/bank.controller';
import { protect } from '../../../shared/middlewares/auth.middleware';

const BankRouter = Router();

BankRouter.get('/wallet', protect, BankCtrl.getMyWallet);
BankRouter.post('/deposit', protect, BankCtrl.simulateDeposit);
BankRouter.post('/savings/subscribe', protect, BankCtrl.subscribeToPlan);
BankRouter.get('/savings/plans', protect, BankCtrl.getAvailablePlans);
BankRouter.post('/transfer', protect, BankCtrl.transferFunds);


export default BankRouter;