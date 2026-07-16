import cron from 'node-cron';
import { BankService } from '../services/bank.service';

export const initBankCron = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('--- Lancement du traitement bancaire quotidien ---');
        await BankService.autoProcessSavings();
    });
};