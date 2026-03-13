// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export const registerFreelancer = async (req: Request, res: Response) => {
    try {
        const result = await service.registerFreelancer(req.body);
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const result = await service.verifyEmail(req.query.token as string);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await service.login(req.body);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};