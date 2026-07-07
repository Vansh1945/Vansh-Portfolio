import Project from '../models/Project.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../config/cloudinaryConfig.js';

// Parse array inputs which might be sent as stringified JSON or comma-separated lists
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [field];
  } catch (e) {
    return field.split(',').map(item => item.trim()).filter(Boolean);
  }
};

// 1. Get All Projects (Public/Admin, Search, Category, Pagination, Sorting)
export const getProjects = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      projectOwnership,
      status, 
      sort = 'displayOrder'
    } = req.query;

    const query = {};

    // Search filter (on title, shortDescription, description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Project Ownership filter (Personal, Client, etc.)
    if (projectOwnership) {
      query.projectOwnership = projectOwnership;
    }

    // Status filter
    if (status) {
      query.status = status;
    } else if (req.query.admin !== 'true') {
      query.status = 'published'; // Default to published for general public
    }

    // Sorting structure
    let sortOption = {};
    if (sort === 'displayOrder') {
      sortOption = { displayOrder: 1, createdAt: -1 };
    } else {
      sortOption = { [sort]: -1 };
    }

    const count = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects.',
      error: error.message
    });
  }
};

// 2. Get Featured Projects (Public)
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true, status: 'published' })
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured projects.',
      error: error.message
    });
  }
};

// 3. Get Project By Slug (Public)
export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project details.',
      error: error.message
    });
  }
};

// 4. Create Project (Admin Only)
export const createProject = async (req, res) => {
  try {
    const {
      title,
      projectOwnership,
      shortDescription,
      description,
      category,
      technologies,
      features,
      liveDemo,
      githubRepo,
      status,
      featured,
      displayOrder
    } = req.body;

    let coverImage = '';
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const result = await uploadToCloudinary(req.files.coverImage[0].buffer, 'portfolio/projects');
      coverImage = result.secure_url;
    } else {
      return res.status(400).json({ success: false, message: 'Cover image is required' });
    }

    let gallery = [];
    if (req.files && req.files.galleryImages) {
      const uploadPromises = req.files.galleryImages.map(file =>
        uploadToCloudinary(file.buffer, 'portfolio/projects')
      );
      const results = await Promise.all(uploadPromises);
      gallery = results.map(r => r.secure_url);
    }

    const newProject = new Project({
      title,
      projectOwnership,
      shortDescription,
      description,
      coverImage,
      gallery,
      category,
      technologies: parseArrayField(technologies),
      features: parseArrayField(features),
      liveDemo,
      githubRepo,
      status: status || 'published',
      featured: featured === 'true' || featured === true,
      displayOrder: displayOrder || 0
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      data: newProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create project.',
      error: error.message
    });
  }
};

// 5. Update Project (Admin Only)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const updateData = { ...req.body };

    // Format array fields
    if (updateData.technologies !== undefined) {
      updateData.technologies = parseArrayField(updateData.technologies);
    }
    if (updateData.features !== undefined) {
      updateData.features = parseArrayField(updateData.features);
    }

    // Format boolean
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }

    // Handle single coverImage update
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      // Delete old cover from Cloudinary
      const oldPublicId = getPublicIdFromUrl(project.coverImage);
      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      const result = await uploadToCloudinary(req.files.coverImage[0].buffer, 'portfolio/projects');
      updateData.coverImage = result.secure_url;
    }

    // Handle galleryImages replacement
    if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
      // Delete old gallery images from Cloudinary
      if (project.gallery && project.gallery.length > 0) {
        const deletePromises = project.gallery.map(url => {
          const publicId = getPublicIdFromUrl(url);
          return publicId ? deleteFromCloudinary(publicId) : Promise.resolve();
        });
        await Promise.all(deletePromises);
      }
      // Upload new gallery images
      const uploadPromises = req.files.galleryImages.map(file =>
        uploadToCloudinary(file.buffer, 'portfolio/projects')
      );
      const results = await Promise.all(uploadPromises);
      updateData.gallery = results.map(r => r.secure_url);
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully!',
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project.',
      error: error.message
    });
  }
};

// 6. Delete Project (Admin Only)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Delete Cover Image from Cloudinary
    const coverPublicId = getPublicIdFromUrl(project.coverImage);
    if (coverPublicId) {
      await deleteFromCloudinary(coverPublicId);
    }

    // Delete Gallery Images from Cloudinary
    if (project.gallery && project.gallery.length > 0) {
      const deletePromises = project.gallery.map(url => {
        const publicId = getPublicIdFromUrl(url);
        return publicId ? deleteFromCloudinary(publicId) : Promise.resolve();
      });
      await Promise.all(deletePromises);
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project.',
      error: error.message
    });
  }
};
