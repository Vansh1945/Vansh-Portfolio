import express from 'express';
import { 
  createExperience, 
  updateExperience, 
  deleteExperience, 
  getAllExperiences, 
  getSingleExperience, 
  getFeaturedExperiences 
} from '../controllers/experienceController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadExperienceLogo } from '../middlewares/uploadMiddleware.js';
import { experienceValidationRules, validateResult } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// GET /api/experiences - Fetch all active experiences (Public)
router.get('/', getAllExperiences);

// GET /api/experiences/featured - Fetch featured active experiences (Public)
router.get('/featured', getFeaturedExperiences);

// GET /api/experiences/:id - Fetch single experience record (Public)
router.get('/:id', getSingleExperience);

// POST /api/experiences - Add new experience (Admin only, JWT protected, Logo upload, Input validated)
router.post('/', protect, uploadExperienceLogo, experienceValidationRules, validateResult, createExperience);

// PUT /api/experiences/:id - Update an experience (Admin only, JWT protected, Logo upload, Input validated)
router.put('/:id', protect, uploadExperienceLogo, experienceValidationRules, validateResult, updateExperience);

// DELETE /api/experiences/:id - Delete an experience (Admin only, JWT protected)
router.delete('/:id', protect, deleteExperience);

export default router;
