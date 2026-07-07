import express from 'express';
import { loginUser, verifyPin, registerUser, getProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register - Register a user
router.post('/register', registerUser);

// POST /api/auth/login - User Login & Token generation (Step 1)
router.post('/login', loginUser);

// POST /api/auth/verify-pin - Verify 4-Digit PIN (Step 2)
router.post('/verify-pin', verifyPin);

// GET /api/auth/profile - Fetch current profile
router.get('/profile', protect, getProfile);

export default router;
