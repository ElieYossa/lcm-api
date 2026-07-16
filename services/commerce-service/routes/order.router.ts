import { Router } from 'express';
import * as OrderCtrl from '../controllers/order.controller';
import { protect } from '../../../shared/middlewares/auth.middleware';

const OrderRouter = Router();

OrderRouter.use(protect);

OrderRouter.get('/my-orders', OrderCtrl.getMyOrders);
OrderRouter.post('/checkout', OrderCtrl.checkout);
OrderRouter.post('/confirm-delivery', OrderCtrl.confirmDelivery);

export default OrderRouter;