import { Router } from 'express';
import { handleAddExperience, handleDeleteExperience } from '../controllers/portfolioController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', requireAdmin, handleAddExperience);
router.delete('/:id', requireAdmin, handleDeleteExperience);

export default router;
