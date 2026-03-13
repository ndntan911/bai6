import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import {
    // Freelancer
    freelancerSendRequest,
} from '../controllers/work-request.controller';

const router = Router();

// ── Freelancer ───────────────────────────────────────────────────────────────
router.post(
    '/freelancer/work-requests',
    authenticate,
    requireRole('freelancer'),
    freelancerSendRequest,
);

export default router;