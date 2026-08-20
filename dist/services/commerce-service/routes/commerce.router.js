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
const CommerceCtrl = __importStar(require("../controllers/commerce.controller"));
const auth_middleware_1 = require("../../../shared/middlewares/auth.middleware");
const uploadConfig_1 = require("../../../shared/utils/uploadConfig");
const Comrouter = (0, express_1.Router)();
Comrouter.get('/products', CommerceCtrl.listProducts);
Comrouter.get('/nearby-products', CommerceCtrl.getNearbyProducts);
Comrouter.get('/nearby-shops', CommerceCtrl.getNearbyShops);
Comrouter.get('/orders/:orderId/tracking', auth_middleware_1.protect, CommerceCtrl.getOrderTracking);
Comrouter.post('/services/book', auth_middleware_1.protect, CommerceCtrl.requestBooking);
Comrouter.use(auth_middleware_1.protect);
Comrouter.use((0, auth_middleware_1.restrictTo)('merchant', 'admin'));
Comrouter.post('/shops', uploadConfig_1.upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'documents', maxCount: 1 }
]), CommerceCtrl.createShop);
Comrouter.get('/shops/my', CommerceCtrl.getMyShops);
Comrouter.get('/products/my', CommerceCtrl.getMyProducts);
Comrouter.patch('/shops/:shopId', uploadConfig_1.upload.single('icon'), CommerceCtrl.updateShop);
Comrouter.delete('/shops/:shopId', CommerceCtrl.deleteShop);
Comrouter.post('/shops/:shopId/products', uploadConfig_1.upload.single('icon'), CommerceCtrl.addProduct);
Comrouter.patch('/products/:productId', uploadConfig_1.upload.single('image'), CommerceCtrl.updateProduct);
Comrouter.delete('/products/:productId', CommerceCtrl.deleteProduct);
Comrouter.post('/shops/:shopId/services', CommerceCtrl.offerService);
exports.default = Comrouter;
