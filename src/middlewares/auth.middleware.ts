import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string; role: string;
        };
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const requireRole = (role: string) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };