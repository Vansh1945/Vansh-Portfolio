import Experience from '../models/Experience.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../config/cloudinaryConfig.js';

// Helper to parse array fields from body (string/comma-separated or json array)
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // fallback split
  }
  return typeof field === 'string' ? field.split(',').map(f => f.trim()).filter(Boolean) : [];
};

// 1. Create Experience (Admin only)
export const createExperience = async (req, res) => {
  try {
    const { 
      title, 
      organization, 
      employmentType, 
      startDate, 
      endDate, 
      currentlyWorking, 
      location, 
      summary, 
      responsibilities, 
      achievements, 
      technologies, 
      liveProjectUrl, 
      githubUrl, 
      displayOrder, 
      featured, 
      status 
    } = req.body;

    let companyLogo = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/experience');
      companyLogo = result.secure_url;
    }

    const newExperience = new Experience({
      title,
      organization,
      employmentType,
      startDate,
      endDate: currentlyWorking === 'true' || currentlyWorking === true ? null : endDate,
      currentlyWorking: currentlyWorking === 'true' || currentlyWorking === true,
      location,
      summary,
      responsibilities: parseArrayField(responsibilities),
      achievements: parseArrayField(achievements),
      technologies: parseArrayField(technologies),
      companyLogo,
      liveProjectUrl,
      githubUrl,
      displayOrder: displayOrder || 0,
      featured: featured === 'true' || featured === true,
      status: status || 'active'
    });

    await newExperience.save();

    res.status(201).json({
      success: true,
      message: 'Experience created successfully!',
      data: newExperience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create experience record.',
      error: error.message
    });
  }
};

// 2. Update Experience (Admin only)
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience record not found.' });
    }

    const updateData = { ...req.body };

    // Format array fields
    if (updateData.responsibilities !== undefined) {
      updateData.responsibilities = parseArrayField(updateData.responsibilities);
    }
    if (updateData.achievements !== undefined) {
      updateData.achievements = parseArrayField(updateData.achievements);
    }
    if (updateData.technologies !== undefined) {
      updateData.technologies = parseArrayField(updateData.technologies);
    }

    // Format boolean conversions
    if (updateData.currentlyWorking !== undefined) {
      updateData.currentlyWorking = updateData.currentlyWorking === 'true' || updateData.currentlyWorking === true;
      if (updateData.currentlyWorking) {
        updateData.endDate = null;
      }
    }
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }

    // Handle logo image update
    if (req.file) {
      // Delete old logo from Cloudinary
      const oldPublicId = getPublicIdFromUrl(experience.companyLogo);
      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      // Upload new logo
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/experience');
      updateData.companyLogo = result.secure_url;
    }

    const updatedExperience = await Experience.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully!',
      data: updatedExperience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update experience record.',
      error: error.message
    });
  }
};

// 3. Delete Experience (Admin only)
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience record not found.' });
    }

    // Delete logo from Cloudinary
    const publicId = getPublicIdFromUrl(experience.companyLogo);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    await Experience.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Experience record deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete experience record.',
      error: error.message
    });
  }
};

// 4. Get All Experiences (Public) - Sort by displayOrder and then by startDate
export const getAllExperiences = async (req, res) => {
  try {
    // Public queries get only 'active' experiences
    const filter = req.query.all === 'true' ? {} : { status: 'active' };
    const experiences = await Experience.find(filter).sort({ displayOrder: 1, startDate: -1 });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience list.',
      error: error.message
    });
  }
};

// 5. Get Single Experience (Public)
export const getSingleExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience record not found.' });
    }

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience details.',
      error: error.message
    });
  }
};

// 6. Get Featured Experiences (Public) - Sort by displayOrder and then by startDate
export const getFeaturedExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ featured: true, status: 'active' }).sort({ displayOrder: 1, startDate: -1 });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured experiences.',
      error: error.message
    });
  }
};
