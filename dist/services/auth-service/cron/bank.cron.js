"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBankCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const bank_service_1 = require("../services/bank.service");
const initBankCron = () => {
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('--- Lancement du traitement bancaire quotidien ---');
        await bank_service_1.BankService.autoProcessSavings();
    });
};
exports.initBankCron = initBankCron;
