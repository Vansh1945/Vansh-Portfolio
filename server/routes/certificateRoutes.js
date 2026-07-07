import express from 'express';
import { getCertificates, createCertificate, deleteCertificate, updateCertificate } from '../controllers/certificateController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// GET /api/certificates - Fetch all certificates
router.get('/', getCertificates);

// POST /api/certificates - Add a new certificate (admin only, JWT protected, image upload handle)
router.post('/', protect, uploadSingleImage, createCertificate);

// PUT /api/certificates/:id - Update a certificate (admin only, JWT protected, image upload handle)
router.put('/:id', protect, uploadSingleImage, updateCertificate);

// DELETE /api/certificates/:id - Delete a certificate (admin only)
router.delete('/:id', protect, deleteCertificate);

export default router;
