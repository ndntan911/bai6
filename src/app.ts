import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import workRequestRoutes from './routes/work-request.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', workRequestRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => console.log('Server running on port 3000'));
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });
