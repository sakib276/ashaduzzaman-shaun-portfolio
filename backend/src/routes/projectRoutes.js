import { Router } from 'express';
import { handleAddProject, handleDeleteProject } from '../controllers/portfolioController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', requireAdmin, handleAddProject);
router.delete('/:id', requireAdmin, handleDeleteProject);

export default router;
