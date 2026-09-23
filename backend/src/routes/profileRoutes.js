import { Router } from 'express';
import { handleUpdateProfile } from '../controllers/portfolioController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.put('/', requireAdmin, handleUpdateProfile);

export default router;
