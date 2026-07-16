// services/auth-service/index.ts

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initModels } from '../../shared/models/index.model'; 
import router from './routes/routes';
import { initBankCron } from './cron/bank.cron';
import path from 'path';

const app: Application = express();
const PORT = process.env.AUTH_PORT || 5000;

app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }}));

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));


app.use('/api', router);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

initModels().then(() => {
    initBankCron(); 
    app.listen(PORT, () => {
        console.log(`Auth Service started on port ${PORT}`);
    });
});