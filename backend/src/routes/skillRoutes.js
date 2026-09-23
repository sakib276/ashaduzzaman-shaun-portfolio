import { Router } from 'express';
import { handleAddAchievement, handleDeleteAchievement } from '../controllers/portfolioController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', requireAdmin, handleAddAchievement);
router.delete('/:id', requireAdmin, handleDeleteAchievement);

export default router;
