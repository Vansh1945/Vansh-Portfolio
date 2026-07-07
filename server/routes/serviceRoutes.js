import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/services - Retrieve all services (public)
router.get('/', getServices);

// POST /api/services - Create a service (admin, JWT protected)
router.post('/', protect, createService);

// PUT /api/services/:id - Update a service (admin, JWT protected)
router.put('/:id', protect, updateService);

// DELETE /api/services/:id - Delete a service (admin, JWT protected)
router.delete('/:id', protect, deleteService);

export default router;
