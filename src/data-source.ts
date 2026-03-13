import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { OwnerProfile } from './entities/owner-profile.entity';
import { FreelancerProfile } from './entities/freelancer-profile.entity';
import { Store } from './entities/store.entity';
import { WorkRequest } from './entities/work-request.entity';
import { Contract } from './entities/contract.entity';
import { EmailVerification } from './entities/email-verification.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'shop_management',
    synchronize: true,
    logging: false,
    entities: [
        User, OwnerProfile, FreelancerProfile,
        Store, WorkRequest, Contract, EmailVerification,
    ],
    migrations: ['src/migrations/*.ts'],
});