"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsArrived = exports.markAsPickedUp = exports.updateGPS = exports.acceptOrder = exports.getMyDeliveries = exports.listAvailable = void 0;
const driver_service_1 = require("../services/driver.service");
const responseHandler_1 = require("../../../shared/utils/responseHandler");
const listAvailable = async (req, res) => {
    try {
        const orders = await driver_service_1.DriverService.getAvailableOrders();
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Commandes prêtes à être livrées", orders);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.listAvailable = listAvailable;
const getMyDeliveries = async (req, res) => {
    try {
        const driverId = req.user.id;
        const myDeliveries = await driver_service_1.DriverService.getMyActiveDeliveries(driverId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Vos livraisons actives", myDeliveries);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getMyDeliveries = getMyDeliveries;
const acceptOrder = async (req, res) => {
    try {
        const driverId = req.user.id;
        const { orderId } = req.body;
        const delivery = await driver_service_1.DriverService.acceptDelivery(driverId, orderId);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Commande acceptée avec succès", delivery);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.acceptOrder = acceptOrder;
const updateGPS = async (req, res) => {
    try {
        const driverId = req.user.id;
        const { deliveryId, lat, lng } = req.body;
        await driver_service_1.DriverService.updateLocation(deliveryId, driverId, lat, lng);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Position GPS mise à jour");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.updateGPS = updateGPS;
const markAsPickedUp = async (req, res) => {
    try {
        const driverId = req.user.id;
        const deliveryId = req.params.deliveryId;
        const delivery = await driver_service_1.DriverService.pickUpOrder(deliveryId, driverId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Colis récupéré à la boutique", delivery);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.markAsPickedUp = markAsPickedUp;
const markAsArrived = async (req, res) => {
    try {
        const driverId = req.user.id;
        const deliveryId = req.params.deliveryId;
        const delivery = await driver_service_1.DriverService.arriveAtDestination(deliveryId, driverId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Arrivée confirmée. En attente du code OTP client.", delivery);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.markAsArrived = markAsArrived;
