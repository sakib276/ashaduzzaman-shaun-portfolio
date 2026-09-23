import { Router } from 'express';
import {
  getPortfolioData,
  handleUpdateProfile,
  handleAddAchievement,
  handleDeleteAchievement,
  handleAddProject,
  handleDeleteProject,
  handleAddExperience,
  handleDeleteExperience,
  handleAddEducation,
  handleDeleteEducation
} from '../controllers/portfolioController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getPortfolioData);

// Admin-protected routes
router.put('/profile', requireAdmin, handleUpdateProfile);

router.post('/achievements', requireAdmin, handleAddAchievement);
router.delete('/achievements/:id', requireAdmin, handleDeleteAchievement);

router.post('/projects', requireAdmin, handleAddProject);
router.delete('/projects/:id', requireAdmin, handleDeleteProject);

router.post('/experience', requireAdmin, handleAddExperience);
router.delete('/experience/:id', requireAdmin, handleDeleteExperience);

router.post('/education', requireAdmin, handleAddEducation);
router.delete('/education/:id', requireAdmin, handleDeleteEducation);

export default router;
