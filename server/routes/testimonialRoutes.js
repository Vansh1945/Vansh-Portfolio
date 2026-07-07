import express from 'express';
import { 
  createTestimonial, 
  getApprovedTestimonials, 
  getAllTestimonials, 
  approveTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadClientImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// GET /api/testimonials - Get all approved testimonials (Public)
router.get('/', getApprovedTestimonials);

// POST /api/testimonials - Create a testimonial (Admin only)
router.post('/', protect, uploadClientImage, createTestimonial);

// GET /api/testimonials/all - Get all testimonials (Admin only)
router.get('/all', protect, getAllTestimonials);

// PUT /api/testimonials/:id/approve - Approve a testimonial (Admin only)
router.put('/:id/approve', protect, approveTestimonial);

// DELETE /api/testimonials/:id - Delete a testimonial (Admin only)
router.delete('/:id', protect, deleteTestimonial);

export default router;
