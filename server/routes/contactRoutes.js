import express from 'express';
import { 
  createContactMessage, 
  getContactMessages, 
  deleteContactMessage, 
  toggleReadStatus 
} from '../controllers/contactController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/contact - Create a new message (Public)
router.post('/', createContactMessage);

// GET /api/contact - Get all messages (Admin only)
router.get('/', protect, getContactMessages);

// PATCH /api/contact/:id/read - Toggle read status (Admin only)
router.patch('/:id/read', protect, toggleReadStatus);

// DELETE /api/contact/:id - Delete message (Admin only)
router.delete('/:id', protect, deleteContactMessage);

export default router;
