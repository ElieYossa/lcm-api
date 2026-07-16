import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { initModels } from '../../shared/models/index.model'; 
import routes from './routes/routes';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const app: Application = express();
const PORT = process.env.ADMIN_PORT || 5003;

app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

initModels().then(() => {
    app.listen(PORT, () => {
        console.log(`Admin Service started on port ${PORT}`);
    });
});