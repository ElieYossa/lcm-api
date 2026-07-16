import { Request, Response } from 'express';
import { BankService } from '../services/bank.service';
import { sendResponse } from '../../../shared/utils/responseHandler';
import { SavingsPlan } from '../../../shared/models/index.model';


export const getMyWallet = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const walletData = await BankService.getGlobalBalance(userId);
        
        return sendResponse(res, 200, true, "Portefeuille récupéré avec succès", walletData);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const simulateDeposit = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { amount, currency, reference } = req.body;

        if (!amount || amount <= 0) throw new Error("Le montant doit être supérieur à 0");

        const updatedWallet = await BankService.deposit(userId, amount, currency || 'USD', reference);
        
        return sendResponse(res, 200, true, `Dépôt de ${amount} ${currency || 'USD'} réussi`, updatedWallet);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const transferFunds = async (req: Request, res: Response) => {
    try {
        const fromUserId = (req as any).user.id;
        const { toUserId, amount, description } = req.body;

        if (!toUserId || !amount || amount <= 0) {
            throw new Error("Informations de transfert incomplètes ou invalides");
        }

        await BankService.transfer(fromUserId, toUserId, amount, description || 'Transfert amical');
        
        return sendResponse(res, 200, true, "Transfert effectué avec succès");
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};

export const subscribeToPlan = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { planId, amount } = req.body;

        if (!planId || !amount) throw new Error("Plan et montant requis");

        const saving = await BankService.startSaving(userId, planId, amount);
        
        return sendResponse(res, 201, true, "Souscription à l'épargne réussie. Vos fonds sont désormais bloqués et génèrent des intérêts.", saving);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};


export const getAvailablePlans = async (req: Request, res: Response) => {
    try {
        const plans = await SavingsPlan.findAll({
            order: [['durationMonths', 'ASC']]
        });
        return sendResponse(res, 200, true, "Liste des plans d'épargne récupérée", plans);
    } catch (error: any) {
        return sendResponse(res, 400, false, error.message);
    }
};