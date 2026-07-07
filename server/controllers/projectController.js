import fs from 'fs';
import path from 'path';
import Project from '../models/Project.js';

// Helper to delete local uploaded files
const deleteLocalFile = (fileUrl) => {
  if (fileUrl && fileUrl.includes('/uploads/projects/')) {
    const filename = fileUrl.split('/uploads/projects/')[1];
    const filePath = path.join(process.cwd(), 'uploads', 'projects', filename);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting file: ${filePath}`, err);
      });
    }
  }
};

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
      coverImage = `${req.protocol}://${req.get('host')}/uploads/projects/${req.files.coverImage[0].filename}`;
    } else {
      return res.status(400).json({ success: false, message: 'Cover image is required' });
    }

    let gallery = [];
    if (req.files && req.files.galleryImages) {
      gallery = req.files.galleryImages.map(
        file => `${req.protocol}://${req.get('host')}/uploads/projects/${file.filename}`
      );
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
    // Delete uploaded files on failure
    if (req.files) {
      if (req.files.coverImage && req.files.coverImage[0]) {
        fs.unlinkSync(req.files.coverImage[0].path);
      }
      if (req.files.galleryImages) {
        req.files.galleryImages.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
    }

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
      deleteLocalFile(project.coverImage);
      updateData.coverImage = `${req.protocol}://${req.get('host')}/uploads/projects/${req.files.coverImage[0].filename}`;
    }

    // Handle galleryImages replacement
    if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
      // Clear old gallery images
      if (project.gallery && project.gallery.length > 0) {
        project.gallery.forEach(fileUrl => deleteLocalFile(fileUrl));
      }
      updateData.gallery = req.files.galleryImages.map(
        file => `${req.protocol}://${req.get('host')}/uploads/projects/${file.filename}`
      );
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

    // Delete Cover Image from disk
    deleteLocalFile(project.coverImage);

    // Delete Gallery Images from disk
    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach(fileUrl => deleteLocalFile(fileUrl));
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
