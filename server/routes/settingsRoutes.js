import express from 'express';
import { 
  getSettings, 
  updateSettings, 
  updateSettingsImages, 
  updateSettingsResume, 
  deleteSettingsResume 
} from '../controllers/settingsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadSettings } from '../middlewares/uploadSettingsMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Error validation result processor
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(e => e.msg) 
    });
  }
  next();
};

// Validation rules
const settingsRules = [
  body('websiteName').notEmpty().withMessage('Website Name is required').trim(),
  body('developerName').notEmpty().withMessage('Developer Name is required').trim(),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('A valid email address is required').trim()
];

// GET /api/settings - Public retrieval
router.get('/', getSettings);

// PUT /api/settings - Update text settings (Admin only)
router.put('/', protect, settingsRules, validate, updateSettings);

// PATCH /api/settings/images - Update settings images (Admin only)
router.patch('/images', protect, uploadSettings, updateSettingsImages);

// PATCH /api/settings/resume - Upload settings resume PDF (Admin only)
router.patch('/resume', protect, uploadSettings, updateSettingsResume);

// DELETE /api/settings/resume - Delete resume PDF file (Admin only)
router.delete('/resume', protect, deleteSettingsResume);

export default router;
