"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderTracking = exports.getNearbyProducts = exports.getNearbyShops = exports.requestBooking = exports.offerService = exports.listProducts = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.deleteShop = exports.updateShop = exports.getMyProducts = exports.getMyShops = exports.createShop = void 0;
const commerce_service_1 = require("../services/commerce.service");
const responseHandler_1 = require("../../../shared/utils/responseHandler");
const createShop = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user.id;
        const files = req.files;
        if (files) {
            if (files['icon']) {
                data.logo = files['icon'][0].path;
            }
            if (files['documents']) {
                data.documents = files['documents'][0].path;
            }
        }
        const shop = await commerce_service_1.CommerceService.createShop(userId, data);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Demande de création de boutique envoyée", shop);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.createShop = createShop;
const getMyShops = async (req, res) => {
    try {
        const userId = req.user.id;
        const shops = await commerce_service_1.CommerceService.getAllMyShops(userId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Vos boutiques récupérées", shops);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getMyShops = getMyShops;
const getMyProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await commerce_service_1.CommerceService.getMyProducts(userId, req.query);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Vos produits ont été récupérés avec succès", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getMyProducts = getMyProducts;
const updateShop = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;
        const shop = await commerce_service_1.CommerceService.updateShop(req.params.shopId, userId, data);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Boutique mise à jour avec succès", shop);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.updateShop = updateShop;
const deleteShop = async (req, res) => {
    try {
        const userId = req.user.id;
        await commerce_service_1.CommerceService.deleteShop(req.params.shopId, userId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Boutique supprimée définitivement");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.deleteShop = deleteShop;
const addProduct = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const data = req.body;
        if (req.file) {
            data.icon = req.file.path;
        }
        const product = await commerce_service_1.CommerceService.addProduct(shopId, data);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Produit ajouté pour validation par l'admin", product);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.addProduct = addProduct;
const updateProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;
        const product = await commerce_service_1.CommerceService.updateProduct(req.params.productId, userId, data);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Produit mis à jour et soumis à nouveau pour validation", product);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;
        await commerce_service_1.CommerceService.deleteProduct(req.params.productId, userId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Produit supprimé avec succès");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.deleteProduct = deleteProduct;
const listProducts = async (req, res) => {
    try {
        const result = await commerce_service_1.CommerceService.getApprovedProducts(req.query);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Liste des produits récupérée avec succès", result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.listProducts = listProducts;
const offerService = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const data = req.body;
        const offer = await commerce_service_1.CommerceService.createServiceOffer(shopId, data);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Offre de service créée, en attente de validation admin", offer);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.offerService = offerService;
const requestBooking = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { serviceOfferId } = req.body;
        const data = req.body;
        const booking = await commerce_service_1.CommerceService.bookRequest(clientId, serviceOfferId, data);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Réservation effectuée et acompte prélevé", booking);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.requestBooking = requestBooking;
const getNearbyShops = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        if (!lat || !lng)
            throw new Error("La latitude (lat) et la longitude (lng) sont requises");
        const shops = await commerce_service_1.CommerceService.getNearbyShops(Number(lat), Number(lng), radius ? Number(radius) : undefined);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `${shops.length} boutique(s) trouvée(s) à proximité`, shops);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getNearbyShops = getNearbyShops;
const getNearbyProducts = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return (0, responseHandler_1.sendResponse)(res, 400, false, "La latitude et la longitude sont requises pour la recherche de proximité");
        }
        const data = req.query;
        const result = await commerce_service_1.CommerceService.getNearbyProducts(data);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `Produits trouvés dans un rayon de ${data.radius || 10}km`, result);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getNearbyProducts = getNearbyProducts;
const getOrderTracking = async (req, res) => {
    try {
        const clientId = req.user.id;
        const orderId = req.params.orderId;
        const trackingInfo = await commerce_service_1.CommerceService.getDeliveryStatus(orderId, clientId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Détails du suivi de livraison", trackingInfo);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getOrderTracking = getOrderTracking;
