import express from 'express';
import { 
  getProjects, 
  getFeaturedProjects, 
  getProjectBySlug, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadProjectImages } from '../middlewares/uploadMiddleware.js';
import { projectValidationRules, validateResult } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// GET /api/projects - Get all projects (with search, category, pagination) (Public)
router.get('/', getProjects);

// GET /api/projects/featured - Get featured projects (Public)
router.get('/featured', getFeaturedProjects);

// GET /api/projects/:slug - Get single project by slug (Public)
router.get('/:slug', getProjectBySlug);

// POST /api/projects - Create a new project (Admin Only, JWT protected, Image uploads)
router.post(
  '/', 
  protect, 
  uploadProjectImages, 
  projectValidationRules, 
  validateResult, 
  createProject
);

// PUT /api/projects/:id - Update a project (Admin Only, JWT protected, Image uploads)
router.put(
  '/:id', 
  protect, 
  uploadProjectImages, 
  projectValidationRules, 
  validateResult, 
  updateProject
);

// DELETE /api/projects/:id - Delete a project (Admin Only, JWT protected)
router.delete('/:id', protect, deleteProject);

export default router;
