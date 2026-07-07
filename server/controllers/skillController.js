import Skill from '../models/Skill.js';
import fs from 'fs';
import path from 'path';

// 1. Create Skill (Admin only)
export const createSkill = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    let logo = '';
    if (req.file) {
      logo = `${req.protocol}://${req.get('host')}/uploads/skills/${req.file.filename}`;
    } else {
      return res.status(400).json({ success: false, message: 'Skill logo is required' });
    }

    const newSkill = new Skill({
      name,
      logo
    });

    await newSkill.save();

    res.status(201).json({
      success: true,
      message: 'Skill created successfully!',
      data: newSkill
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create skill.',
      error: error.message
    });
  }
};

// 2. Get All Skills (Public)
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve skills.',
      error: error.message
    });
  }
};

// 3. Update Skill (Admin only)
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    const updateData = {};
    if (name) updateData.name = name;

    if (req.file) {
      // Delete old logo
      if (skill.logo && skill.logo.includes('/uploads/skills/')) {
        const oldFilename = skill.logo.split('/uploads/skills/')[1];
        const oldFilePath = path.join(process.cwd(), 'uploads', 'skills', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.logo = `${req.protocol}://${req.get('host')}/uploads/skills/${req.file.filename}`;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully!',
      data: updatedSkill
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update skill.',
      error: error.message
    });
  }
};

// 4. Delete Skill (Admin only)
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    // Delete logo from disk
    if (skill.logo && skill.logo.includes('/uploads/skills/')) {
      const filename = skill.logo.split('/uploads/skills/')[1];
      const filePath = path.join(process.cwd(), 'uploads', 'skills', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Skill.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete skill.',
      error: error.message
    });
  }
};
