import { Router } from 'express';
import { handleAddEducation, handleDeleteEducation } from '../controllers/portfolioController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', requireAdmin, handleAddEducation);
router.delete('/:id', requireAdmin, handleDeleteEducation);

export default router;
