import CurrencyBalance from '../../../shared/models/currencybalance.model'; // Attention aux majuscules selon ton OS
import { Wallet, Transaction, sequelize, User } from '../../../shared/models/index.model';
import SavingsPlan from '../../../shared/models/savingsplan.model';
import { TransactionType } from '../../../shared/models/transaction.model';
import UserSaving from '../../../shared/models/usersaving.model';

export class BankService {

    private static exchangeRates: any = {
        'USD': 1,
        'PI': 0.5,  
        'BTC': 65000,
        'ETH': 3500
    };

    static async getGlobalBalance(userId: string) {
        const wallet = await Wallet.findOne({ 
            where: { userId },
            include: [{ model: CurrencyBalance, as: 'balances' }]
        });

        if (!wallet) throw new Error("Wallet non trouvé");

        const balances = (wallet as any).balances || [];
        let totalCurrentUSD = 0;
        
        const detailedBalances = balances.map((b: any) => {
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
            totalGlobalValueUSD: totalCurrentUSD + parseFloat(wallet.savingsBalance as any),
            fiatBalanceUSD: parseFloat(wallet.balance as any),
            cryptoBalances: detailedBalances,
            lockedSavingsUSD: parseFloat(wallet.savingsBalance as any)
        };
    }

    static async deposit(userId: string, amount: number, currency: string = 'USD', reference: string) {
        const t = await sequelize.transaction();
        try {
            const wallet = await Wallet.findOne({ where: { userId }, transaction: t });
            if (!wallet) throw new Error("Portefeuille introuvable");

            if (currency === 'USD') {
                wallet.balance = Number(wallet.balance) + Number(amount);
                await wallet.save({ transaction: t });
            } else {
                const [cb] = await CurrencyBalance.findOrCreate({
                    where: { walletId: wallet.id, currency },
                    defaults: { amount: 0 },
                    transaction: t
                });
                cb.amount = Number(cb.amount) + Number(amount);
                await cb.save({ transaction: t });
            }

            await Transaction.create({
                walletId: wallet.id,
                amount,
                type: TransactionType.DEPOSIT,
                description: `Dépôt ${currency}`,
                reference: reference || 'DIRECT_DEPOSIT'
            }, { transaction: t });

            await t.commit();
            return this.getGlobalBalance(userId);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async transfer(fromUserId: string, toUserId: string, amount: number, description: string) {
        const t = await sequelize.transaction();
        try {
            const senderWallet = await Wallet.findOne({ where: { userId: fromUserId }, transaction: t });
            const receiverWallet = await Wallet.findOne({ where: { userId: toUserId }, transaction: t });

            if (!senderWallet || !receiverWallet) throw new Error("Un des portefeuilles est introuvable");
            if (Number(senderWallet.balance) < amount) throw new Error("Solde insuffisant");

            senderWallet.balance = Number(senderWallet.balance) - amount;
            await senderWallet.save({ transaction: t });

            receiverWallet.balance = Number(receiverWallet.balance) + amount;
            await receiverWallet.save({ transaction: t });

            await Transaction.create({
                walletId: senderWallet.id,
                amount: -amount,
                type: TransactionType.TRANSFER,
                description: `Envoyé à : ${toUserId} - ${description}`
            }, { transaction: t });

            await Transaction.create({
                walletId: receiverWallet.id,
                amount: amount,
                type: TransactionType.TRANSFER,
                description: `Reçu de : ${fromUserId} - ${description}`
            }, { transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async startSaving(userId: string, planId: string, amount: number) {
        const t = await sequelize.transaction();
        try {
            const wallet = await Wallet.findOne({ where: { userId }, transaction: t });
            const plan = await SavingsPlan.findByPk(planId, { transaction: t });

            if (!wallet || Number(wallet.balance) < amount) throw new Error("Solde USD insuffisant");
            if (!plan || amount < Number(plan.minAmount)) throw new Error("Montant inférieur au minimum du plan");

            wallet.balance = Number(wallet.balance) - amount;
            wallet.savingsBalance = Number(wallet.savingsBalance) + amount;
            await wallet.save({ transaction: t });

            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + plan.durationMonths);

            const saving = await UserSaving.create({
                userId,
                planId,
                initialAmount: amount,
                currentAmount: amount,
                endDate,
                status: 'active'
            }, { transaction: t });
            
            await Transaction.create({
                walletId: wallet.id,
                amount,
                type: TransactionType.TRANSFER,
                description: `Souscription Épargne : ${plan.name}`,
                status: 'completed'
            }, { transaction: t });

            await t.commit();
            return saving;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async autoProcessSavings() {
        const t = await sequelize.transaction();
        try {
            const activeSavings = await UserSaving.findAll({ 
                where: { status: 'active' },
                include: [{ model: SavingsPlan, as: 'plan' }]
            });

            for (const saving of activeSavings) {
                const plan = (saving as any).plan;
                if (!plan) continue;

                const dailyInterest = (Number(saving.currentAmount) * (Number(plan.interestRate) / 100)) / 365;
                saving.currentAmount = Number(saving.currentAmount) + dailyInterest;

                if (new Date() >= new Date(saving.endDate)) {
                    const wallet = await Wallet.findOne({ where: { userId: saving.userId }, transaction: t });
                    if (wallet) {
                        wallet.balance = Number(wallet.balance) + Number(saving.currentAmount);
                        wallet.savingsBalance = Number(wallet.savingsBalance) - Number(saving.initialAmount);
                        await wallet.save({ transaction: t });

                        saving.status = 'completed';
                        
                        await Transaction.create({
                            walletId: wallet.id,
                            amount: saving.currentAmount,
                            type: TransactionType.TRANSFER,
                            description: `Fonds libérés (Épargne terminée) : ${plan.name}`,
                        }, { transaction: t });
                    }
                }
                await saving.save({ transaction: t });
            }
            await t.commit();
        } catch (error) {
            await t.rollback();
            console.error("[CRON ERROR]", error);
        }
    }
}