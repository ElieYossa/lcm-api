"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.confirmDelivery = exports.checkout = void 0;
const order_service_1 = require("../services/order.service");
const responseHandler_1 = require("../../../shared/utils/responseHandler");
const index_model_1 = require("../../../shared/models/index.model");
const checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const order = await order_service_1.OrderService.createOrder(userId, req.body);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Commande payée et placée en séquestre avec succès", order);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.checkout = checkout;
const confirmDelivery = async (req, res) => {
    try {
        const { orderId, otpCode } = req.body;
        if (!orderId || !otpCode)
            throw new Error("ID de commande et code OTP requis");
        const order = await order_service_1.OrderService.completeOrder(orderId, otpCode);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Livraison confirmée. Les fonds ont été libérés aux bénéficiaires.", order);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.confirmDelivery = confirmDelivery;
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await index_model_1.Order.findAll({
            where: { clientId: userId },
            include: ['shop'],
            order: [['createdAt', 'DESC']]
        });
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Historique des commandes récupéré", orders);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getMyOrders = getMyOrders;
