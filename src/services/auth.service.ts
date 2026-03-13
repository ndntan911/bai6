// services/auth.service.ts
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/user.entity';
import { FreelancerProfile } from '../entities/freelancer-profile.entity';
import { EmailVerification } from '../entities/email-verification.entity';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export class AuthService {
    private userRepo = AppDataSource.getRepository(User);

    async registerFreelancer(body: {
        full_name: string;
        phone: string;
        email: string;
        password: string;
        date_of_birth?: string;
        gender?: string;
        street?: string;
        ward?: string;
        district?: string;
        province?: string;
    }) {
        // Check duplicate
        const exists = await this.userRepo.findOne({
            where: [{ email: body.email }, { phone: body.phone }],
        });
        if (exists) {
            const field = exists.email === body.email ? 'Email' : 'Phone';
            throw { status: 409, message: `${field} already in use` };
        }

        const hashed = await bcrypt.hash(body.password, 10);
        const token = crypto.randomBytes(32).toString('hex');

        await AppDataSource.transaction(async (manager) => {
            const user = manager.create(User, {
                full_name: body.full_name,
                phone: body.phone,
                email: body.email,
                password: hashed,
                date_of_birth: body.date_of_birth ? new Date(body.date_of_birth) : null,
                gender: body.gender as any,
                role: UserRole.FREELANCER,
                is_verified: true, // TODO: change to false
            });
            await manager.save(user);

            await manager.save(
                manager.create(FreelancerProfile, {
                    user_id: user.id,
                    street: body.street,
                    ward: body.ward,
                    district: body.district,
                    province: body.province,
                }),
            );

            await manager.save(
                manager.create(EmailVerification, {
                    user_id: user.id,
                    token,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
                }),
            );

            // await this.sendVerificationEmail(body.email, body.full_name, token);
        });

        return {
            message: 'Registration successful. Please check your email to verify your account.',
        };
    }

    private async sendVerificationEmail(
        to: string, name: string, token: string,
    ) {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const link = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
        await transporter.sendMail({
            to,
            subject: 'Verify your account',
            html: `<p>Hi ${name},</p>
             <p>Click <a href="${link}">here</a> to verify your account. Link expires in 24 hours.</p>`,
        });
    }

    async verifyEmail(token: string) {
        const repo = AppDataSource.getRepository(EmailVerification);
        const record = await repo.findOne({ where: { token } });

        if (!record) throw { status: 400, message: 'Invalid token' };
        if (record.used_at) throw { status: 400, message: 'Token already used' };
        if (record.expires_at < new Date())
            throw { status: 400, message: 'Token expired' };

        await AppDataSource.transaction(async (manager) => {
            await manager.update(User, record.user_id, { is_verified: true });
            await manager.update(EmailVerification, record.id, { used_at: new Date() });
        });

        return { message: 'Account verified successfully' };
    }

    async login(body: { credential: string; password: string }) {
        const user = await this.userRepo.findOne({
            where: [
                { email: body.credential },
                { phone: body.credential },
            ],
        });

        if (!user) throw { status: 401, message: 'Invalid credentials' };
        if (!user.is_verified)
            throw { status: 403, message: 'Account not verified. Please check your email.' };

        const match = await bcrypt.compare(body.password, user.password);
        if (!match) throw { status: 401, message: 'Invalid credentials' };

        const access_token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '15m' },
        );
        const refresh_token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' },
        );

        return { access_token, refresh_token };
    }
}

import jwt from 'jsonwebtoken';