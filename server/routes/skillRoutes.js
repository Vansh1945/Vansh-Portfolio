import express from 'express';
import {
  createSkill,
  getAllSkills,
  updateSkill,
  deleteSkill
} from '../controllers/skillController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadSkillLogo } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// GET /api/skills - Get all skills (Public)
router.get('/', getAllSkills);

// POST /api/skills - Create a new skill (Admin only, JWT protected, Logo upload)
router.post('/', protect, uploadSkillLogo, createSkill);

// PUT /api/skills/:id - Update a skill (Admin only, JWT protected, Logo upload)
router.put('/:id', protect, uploadSkillLogo, updateSkill);

// DELETE /api/skills/:id - Delete a skill (Admin only, JWT protected)
router.delete('/:id', protect, deleteSkill);

export default router;
