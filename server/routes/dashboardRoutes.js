import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// GET /api/dashboard/stats - Retrieve MERN portfolio stats (Admin only)
router.get('/stats', protect, getDashboardStats);

export default router;
