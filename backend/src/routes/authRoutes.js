import { Router } from 'express';
import { login, verify } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/securityMiddleware.js';

const router = Router();

router.post('/login', authRateLimiter, login);
router.get('/verify', requireAdmin, verify);

export default router;
