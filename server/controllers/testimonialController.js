import Testimonial from '../models/Testimonial.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../config/cloudinaryConfig.js';

// 1. Submit testimonial (Public)
export const createTestimonial = async (req, res) => {
  try {
    const { clientName, message, rating } = req.body;

    if (!clientName || !message || rating === undefined) {
      return res.status(400).json({ message: 'Client name, message, and rating are required.' });
    }

    let clientImageUrl = undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/testimonials');
      clientImageUrl = result.secure_url;
    }

    const testimonial = new Testimonial({
      clientName,
      clientImage: clientImageUrl,
      message,
      rating,
      approved: true // Enforce approved true since created by admin
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully!',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial.',
      error: error.message
    });
  }
};

// 2. Fetch approved testimonials (Public)
export const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials.',
      error: error.message
    });
  }
};

// 3. Fetch all testimonials (Admin only)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all testimonials.',
      error: error.message
    });
  }
};

// 4. Approve a testimonial (Admin only)
export const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, { approved: true }, { new: true });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial approved successfully!',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve testimonial.',
      error: error.message
    });
  }
};

// 5. Delete a testimonial (Admin only)
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    // Delete client image from Cloudinary if exists
    if (testimonial.clientImage) {
      const publicId = getPublicIdFromUrl(testimonial.clientImage);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await Testimonial.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial.',
      error: error.message
    });
  }
};
