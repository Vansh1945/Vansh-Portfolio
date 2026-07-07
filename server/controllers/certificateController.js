import Certificate from '../models/Certificate.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../config/cloudinaryConfig.js';

// Default certificates to seed if the database is empty
const defaultCertificates = [
  {
    title: 'Full Stack Web Development',
    issuer: 'Udemy / Online Academy',
    date: '2024',
    credentialId: 'UC-45a892b1-0982',
    image: 'https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive program covering React, Node.js, Express, MongoDB, RESTful APIs, and responsive design systems.',
    category: 'Full Stack'
  },
  {
    title: 'Advanced React & State Management',
    issuer: 'Meta / Coursera',
    date: '2024',
    credentialId: 'COUR-RX8721A',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
    description: 'Specialization in custom hooks, Context API, Redux Toolkit, performance profiling, and visual layout optimizations.',
    category: 'Frontend'
  },
  {
    title: 'Node.js Backend & API Architectures',
    issuer: 'FreeCodeCamp',
    date: '2023',
    credentialId: 'FCC-NODE-990',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Practical training on Express routing, MongoDB schema design, JWT-based security protocols, and server deployment.',
    category: 'Backend'
  }
];

// Fetch all certificates (and seed if empty)
export const getCertificates = async (req, res) => {
  try {
    let certificates = await Certificate.find().sort({ displayOrder: 1, createdAt: -1 });

    if (certificates.length === 0) {
      console.log('Seeding default certificates...');
      await Certificate.insertMany(defaultCertificates);
      certificates = await Certificate.find().sort({ displayOrder: 1, createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve certificates.',
      error: error.message,
    });
  }
};

// Create a new certificate
export const createCertificate = async (req, res) => {
  try {
    const { title, issuer, date, credentialId, description, category, displayOrder } = req.body;

    let image = req.body.image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates');
      image = result.secure_url;
    }

    if (!title || !issuer || !date || !image) {
      return res.status(400).json({ message: 'Title, issuer, date, and certificate image are required.' });
    }

    const newCertificate = new Certificate({
      title,
      issuer,
      date,
      credentialId,
      image,
      description,
      category,
      displayOrder: displayOrder || 0
    });

    await newCertificate.save();

    res.status(201).json({
      success: true,
      message: 'Certificate added successfully!',
      data: newCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save certificate.',
      error: error.message,
    });
  }
};

// Delete a certificate
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Delete image from Cloudinary
    const publicId = getPublicIdFromUrl(certificate.image);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    await Certificate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete certificate.',
      error: error.message,
    });
  }
};

// Update a certificate
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, issuer, date, credentialId, description, category, displayOrder } = req.body;

    const updateFields = {
      title,
      issuer,
      date,
      credentialId,
      description,
      category,
      displayOrder
    };

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (req.file) {
      // Delete old image from Cloudinary
      const oldPublicId = getPublicIdFromUrl(certificate.image);
      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates');
      updateFields.image = result.secure_url;
    } else if (req.body.image) {
      updateFields.image = req.body.image;
    }

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const updatedCertificate = await Certificate.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

    if (!updatedCertificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully!',
      data: updatedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update certificate.',
      error: error.message,
    });
  }
};
