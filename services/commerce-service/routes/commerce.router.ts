import { Router } from 'express';
import * as CommerceCtrl from '../controllers/commerce.controller';
import { protect, restrictTo } from '../../../shared/middlewares/auth.middleware';
import { upload } from '../../../shared/utils/uploadConfig';

const Comrouter = Router();

Comrouter.get('/products', CommerceCtrl.listProducts);
Comrouter.get('/nearby-products', CommerceCtrl.getNearbyProducts);

Comrouter.get('/nearby-shops', CommerceCtrl.getNearbyShops);


Comrouter.get('/orders/:orderId/tracking', protect, CommerceCtrl.getOrderTracking);
Comrouter.post('/services/book', protect, CommerceCtrl.requestBooking);


Comrouter.use(protect);
Comrouter.use(restrictTo('merchant', 'admin'));


Comrouter.post('/shops', 
    upload.fields([
        { name: 'icon', maxCount: 1 }, 
        { name: 'documents', maxCount: 1 }
    ]), 
    CommerceCtrl.createShop
);

Comrouter.get('/shops/my', CommerceCtrl.getMyShops);
Comrouter.get('/products/my', CommerceCtrl.getMyProducts);
Comrouter.patch('/shops/:shopId', upload.single('icon'), CommerceCtrl.updateShop);
Comrouter.delete('/shops/:shopId', CommerceCtrl.deleteShop);

Comrouter.post('/shops/:shopId/products',upload.single('icon'), CommerceCtrl.addProduct);
Comrouter.patch('/products/:productId', upload.single('image'), CommerceCtrl.updateProduct);
Comrouter.delete('/products/:productId', CommerceCtrl.deleteProduct);

Comrouter.post('/shops/:shopId/services', CommerceCtrl.offerService);

export default Comrouter;