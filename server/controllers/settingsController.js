import WebsiteSettings from '../models/WebsiteSettings.js';
import fs from 'fs';
import path from 'path';

// Clean helper to delete old local files
const deleteLocalFile = (relativePath) => {
  if (!relativePath) return;
  const fullPath = path.resolve(relativePath);
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete local file: ${fullPath}`, err);
    }
  });
};

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    const settings = await WebsiteSettings.findOne();
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    console.error('Error fetching website settings:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve website settings'
    });
  }
};

// PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
    }

    const {
      websiteName, tagline, developerName, designation, email, phone, location,
      github, linkedin, instagram, twitter, facebook, youtube, whatsapp,
      metaTitle, metaDescription, metaKeywords, canonicalUrl, robotsIndex, googleAnalyticsId, googleSearchConsoleVerification
    } = req.body;

    // Update text fields
    settings.websiteName = websiteName || settings.websiteName;
    settings.tagline = tagline;
    settings.developerName = developerName || settings.developerName;
    settings.designation = designation;
    settings.email = email || settings.email;
    settings.phone = phone;
    settings.location = location;

    // Social Links
    settings.github = github;
    settings.linkedin = linkedin;
    settings.instagram = instagram;
    settings.twitter = twitter;
    settings.facebook = facebook;
    settings.youtube = youtube;
    settings.whatsapp = whatsapp;

    // SEO Settings
    settings.metaTitle = metaTitle;
    settings.metaDescription = metaDescription;
    settings.metaKeywords = metaKeywords;
    settings.canonicalUrl = canonicalUrl;
    settings.robotsIndex = robotsIndex;
    settings.googleAnalyticsId = googleAnalyticsId;
    settings.googleSearchConsoleVerification = googleSearchConsoleVerification;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to update website settings'
    });
  }
};

// PATCH /api/settings/images
export const updateSettingsImages = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
    }

    const files = req.files || {};
    const host = `${req.protocol}://${req.get('host')}`;

    if (files.profileImage) {
      if (settings.profileImage) {
        const oldPath = settings.profileImage.replace(host, '.');
        deleteLocalFile(oldPath);
      }
      settings.profileImage = `${host}/uploads/settings/${files.profileImage[0].filename}`;
    }

    if (files.heroImage) {
      if (settings.heroImage) {
        const oldPath = settings.heroImage.replace(host, '.');
        deleteLocalFile(oldPath);
      }
      settings.heroImage = `${host}/uploads/settings/${files.heroImage[0].filename}`;
    }

    if (files.logo) {
      if (settings.logo) {
        const oldPath = settings.logo.replace(host, '.');
        deleteLocalFile(oldPath);
      }
      settings.logo = `${host}/uploads/settings/${files.logo[0].filename}`;
    }

    if (files.favicon) {
      if (settings.favicon) {
        const oldPath = settings.favicon.replace(host, '.');
        deleteLocalFile(oldPath);
      }
      settings.favicon = `${host}/uploads/settings/${files.favicon[0].filename}`;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Images updated successfully',
      data: settings
    });
  } catch (err) {
    console.error('Error updating settings images:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings images'
    });
  }
};

// PATCH /api/settings/resume
export const updateSettingsResume = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
    }

    const files = req.files || {};
    if (!files.resumePdf) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file provided'
      });
    }

    const host = `${req.protocol}://${req.get('host')}`;
    if (settings.resumePdf) {
      const oldPath = settings.resumePdf.replace(host, '.');
      deleteLocalFile(oldPath);
    }

    settings.resumePdf = `${host}/uploads/resume/${files.resumePdf[0].filename}`;
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Resume PDF updated successfully',
      data: settings
    });
  } catch (err) {
    console.error('Error updating settings resume:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload resume PDF'
    });
  }
};

// DELETE /api/settings/resume
export const deleteSettingsResume = async (req, res) => {
  try {
    const settings = await WebsiteSettings.findOne();
    if (!settings || !settings.resumePdf) {
      return res.status(400).json({
        success: false,
        message: 'No resume PDF found to delete'
      });
    }

    const host = `${req.protocol}://${req.get('host')}`;
    const oldPath = settings.resumePdf.replace(host, '.');
    deleteLocalFile(oldPath);

    settings.resumePdf = undefined;
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Resume PDF deleted successfully',
      data: settings
    });
  } catch (err) {
    console.error('Error deleting settings resume:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete resume PDF'
    });
  }
};
