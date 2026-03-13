// controllers/work-request.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { WorkRequestService } from '../services/work-request.service';

const service = new WorkRequestService();

export const freelancerSendRequest = async (req: AuthRequest, res: Response) => {
    try {
        const result = await service.freelancerSendRequest(req.user!.id, req.body.store_id);
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};