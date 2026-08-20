"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankService = void 0;
const currencybalance_model_1 = __importDefault(require("../../../shared/models/currencybalance.model")); // Attention aux majuscules selon ton OS
const index_model_1 = require("../../../shared/models/index.model");
const savingsplan_model_1 = __importDefault(require("../../../shared/models/savingsplan.model"));
const transaction_model_1 = require("../../../shared/models/transaction.model");
const usersaving_model_1 = __importDefault(require("../../../shared/models/usersaving.model"));
class BankService {
    static async getGlobalBalance(userId) {
        const wallet = await index_model_1.Wallet.findOne({
            where: { userId },
            include: [{ model: currencybalance_model_1.default, as: 'balances' }]
        });
        if (!wallet)
            throw new Error("Wallet non trouvé");
        const balances = wallet.balances || [];
        let totalCurrentUSD = 0;
        const detailedBalances = balances.map((b) => {
            const rate = this.exchangeRates[b.currency] || 0;
            const valueInUSD = parseFloat(b.amount) * rate;
            totalCurrentUSD += valueInUSD;
            return {
                currency: b.currency,
                amount: parseFloat(b.amount),
                valueInUSD: valueInUSD
            };
        });
        return {
            userId: userId,
            totalGlobalValueUSD: totalCurrentUSD + parseFloat(wallet.savingsBalance),
            fiatBalanceUSD: parseFloat(wallet.balance),
            cryptoBalances: detailedBalances,
            lockedSavingsUSD: parseFloat(wallet.savingsBalance)
        };
    }
    static async deposit(userId, amount, currency = 'USD', reference) {
        const t = await index_model_1.sequelize.transaction();
        try {
            const wallet = await index_model_1.Wallet.findOne({ where: { userId }, transaction: t });
            if (!wallet)
                throw new Error("Portefeuille introuvable");
            if (currency === 'USD') {
                wallet.balance = Number(wallet.balance) + Number(amount);
                await wallet.save({ transaction: t });
            }
            else {
                const [cb] = await currencybalance_model_1.default.findOrCreate({
                    where: { walletId: wallet.id, currency },
                    defaults: { amount: 0 },
                    transaction: t
                });
                cb.amount = Number(cb.amount) + Number(amount);
                await cb.save({ transaction: t });
            }
            await index_model_1.Transaction.create({
                walletId: wallet.id,
                amount,
                type: transaction_model_1.TransactionType.DEPOSIT,
                description: `Dépôt ${currency}`,
                reference: reference || 'DIRECT_DEPOSIT'
            }, { transaction: t });
            await t.commit();
            return this.getGlobalBalance(userId);
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async transfer(fromUserId, toUserId, amount, description) {
        const t = await index_model_1.sequelize.transaction();
        try {
            const senderWallet = await index_model_1.Wallet.findOne({ where: { userId: fromUserId }, transaction: t });
            const receiverWallet = await index_model_1.Wallet.findOne({ where: { userId: toUserId }, transaction: t });
            if (!senderWallet || !receiverWallet)
                throw new Error("Un des portefeuilles est introuvable");
            if (Number(senderWallet.balance) < amount)
                throw new Error("Solde insuffisant");
            senderWallet.balance = Number(senderWallet.balance) - amount;
            await senderWallet.save({ transaction: t });
            receiverWallet.balance = Number(receiverWallet.balance) + amount;
            await receiverWallet.save({ transaction: t });
            await index_model_1.Transaction.create({
                walletId: senderWallet.id,
                amount: -amount,
                type: transaction_model_1.TransactionType.TRANSFER,
                description: `Envoyé à : ${toUserId} - ${description}`
            }, { transaction: t });
            await index_model_1.Transaction.create({
                walletId: receiverWallet.id,
                amount: amount,
                type: transaction_model_1.TransactionType.TRANSFER,
                description: `Reçu de : ${fromUserId} - ${description}`
            }, { transaction: t });
            await t.commit();
            return true;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async startSaving(userId, planId, amount) {
        const t = await index_model_1.sequelize.transaction();
        try {
            const wallet = await index_model_1.Wallet.findOne({ where: { userId }, transaction: t });
            const plan = await savingsplan_model_1.default.findByPk(planId, { transaction: t });
            if (!wallet || Number(wallet.balance) < amount)
                throw new Error("Solde USD insuffisant");
            if (!plan || amount < Number(plan.minAmount))
                throw new Error("Montant inférieur au minimum du plan");
            wallet.balance = Number(wallet.balance) - amount;
            wallet.savingsBalance = Number(wallet.savingsBalance) + amount;
            await wallet.save({ transaction: t });
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + plan.durationMonths);
            const saving = await usersaving_model_1.default.create({
                userId,
                planId,
                initialAmount: amount,
                currentAmount: amount,
                endDate,
                status: 'active'
            }, { transaction: t });
            await index_model_1.Transaction.create({
                walletId: wallet.id,
                amount,
                type: transaction_model_1.TransactionType.TRANSFER,
                description: `Souscription Épargne : ${plan.name}`,
                status: 'completed'
            }, { transaction: t });
            await t.commit();
            return saving;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    static async autoProcessSavings() {
        const t = await index_model_1.sequelize.transaction();
        try {
            const activeSavings = await usersaving_model_1.default.findAll({
                where: { status: 'active' },
                include: [{ model: savingsplan_model_1.default, as: 'plan' }]
            });
            for (const saving of activeSavings) {
                const plan = saving.plan;
                if (!plan)
                    continue;
                const dailyInterest = (Number(saving.currentAmount) * (Number(plan.interestRate) / 100)) / 365;
                saving.currentAmount = Number(saving.currentAmount) + dailyInterest;
                if (new Date() >= new Date(saving.endDate)) {
                    const wallet = await index_model_1.Wallet.findOne({ where: { userId: saving.userId }, transaction: t });
                    if (wallet) {
                        wallet.balance = Number(wallet.balance) + Number(saving.currentAmount);
                        wallet.savingsBalance = Number(wallet.savingsBalance) - Number(saving.initialAmount);
                        await wallet.save({ transaction: t });
                        saving.status = 'completed';
                        await index_model_1.Transaction.create({
                            walletId: wallet.id,
                            amount: saving.currentAmount,
                            type: transaction_model_1.TransactionType.TRANSFER,
                            description: `Fonds libérés (Épargne terminée) : ${plan.name}`,
                        }, { transaction: t });
                    }
                }
                await saving.save({ transaction: t });
            }
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            console.error("[CRON ERROR]", error);
        }
    }
}
exports.BankService = BankService;
BankService.exchangeRates = {
    'USD': 1,
    'PI': 0.5,
    'BTC': 65000,
    'ETH': 3500
};
