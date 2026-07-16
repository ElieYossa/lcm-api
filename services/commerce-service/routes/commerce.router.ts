import { Router } from 'express';
import * as CommerceCtrl from '../controllers/commerce.controller';
import { protect, restrictTo } from '../../../shared/middlewares/auth.middleware';

const Comrouter = Router();

Comrouter.get('/products', CommerceCtrl.listProducts);
Comrouter.get('/nearby-shops', CommerceCtrl.getNearbyShops);
Comrouter.get('/nearby-products', CommerceCtrl.getNearbyProducts);


Comrouter.get('/orders/:orderId/tracking', protect, CommerceCtrl.getOrderTracking);
Comrouter.post('/services/book', protect, CommerceCtrl.requestBooking);


Comrouter.use(protect);
Comrouter.use(restrictTo('merchant', 'admin'));


Comrouter.post('/shops', CommerceCtrl.createShop);
Comrouter.get('/shops/my', CommerceCtrl.getMyShops);
Comrouter.patch('/shops/:shopId', CommerceCtrl.updateShop);
Comrouter.delete('/shops/:shopId', CommerceCtrl.deleteShop);

Comrouter.post('/shops/:shopId/products', CommerceCtrl.addProduct);
Comrouter.patch('/products/:productId', CommerceCtrl.updateProduct);
Comrouter.delete('/products/:productId', CommerceCtrl.deleteProduct);

Comrouter.post('/shops/:shopId/services', CommerceCtrl.offerService);

export default Comrouter;