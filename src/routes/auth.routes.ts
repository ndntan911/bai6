import { Router } from 'express';
import {
    registerFreelancer,
    verifyEmail,
    login,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register/freelancer', registerFreelancer);
router.get('/verify-email', verifyEmail);
router.post('/login', login);

export default router;