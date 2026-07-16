import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { initModels } from '../../shared/models/index.model';
import router from './routes/routes';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const app: Application = express();
const PORT = process.env.COMMERCE_PORT || 5001;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', router);

initModels().then(() => {
    app.listen(PORT, () => {
        console.log(`Commerce Service started on port ${PORT}`);
    });
});