"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailablePlans = exports.subscribeToPlan = exports.transferFunds = exports.simulateDeposit = exports.getMyWallet = void 0;
const bank_service_1 = require("../services/bank.service");
const responseHandler_1 = require("../../../shared/utils/responseHandler");
const index_model_1 = require("../../../shared/models/index.model");
const getMyWallet = async (req, res) => {
    try {
        const userId = req.user.id;
        const walletData = await bank_service_1.BankService.getGlobalBalance(userId);
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Portefeuille récupéré avec succès", walletData);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getMyWallet = getMyWallet;
const simulateDeposit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, currency, reference } = req.body;
        if (!amount || amount <= 0)
            throw new Error("Le montant doit être supérieur à 0");
        const updatedWallet = await bank_service_1.BankService.deposit(userId, amount, currency || 'USD', reference);
        return (0, responseHandler_1.sendResponse)(res, 200, true, `Dépôt de ${amount} ${currency || 'USD'} réussi`, updatedWallet);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.simulateDeposit = simulateDeposit;
const transferFunds = async (req, res) => {
    try {
        const fromUserId = req.user.id;
        const { toUserId, amount, description } = req.body;
        if (!toUserId || !amount || amount <= 0) {
            throw new Error("Informations de transfert incomplètes ou invalides");
        }
        await bank_service_1.BankService.transfer(fromUserId, toUserId, amount, description || 'Transfert amical');
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Transfert effectué avec succès");
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.transferFunds = transferFunds;
const subscribeToPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { planId, amount } = req.body;
        if (!planId || !amount)
            throw new Error("Plan et montant requis");
        const saving = await bank_service_1.BankService.startSaving(userId, planId, amount);
        return (0, responseHandler_1.sendResponse)(res, 201, true, "Souscription à l'épargne réussie. Vos fonds sont désormais bloqués et génèrent des intérêts.", saving);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.subscribeToPlan = subscribeToPlan;
const getAvailablePlans = async (req, res) => {
    try {
        const plans = await index_model_1.SavingsPlan.findAll({
            order: [['durationMonths', 'ASC']]
        });
        return (0, responseHandler_1.sendResponse)(res, 200, true, "Liste des plans d'épargne récupérée", plans);
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, 400, false, error.message);
    }
};
exports.getAvailablePlans = getAvailablePlans;
