import WebsiteSettings from '../models/WebsiteSettings.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../config/cloudinaryConfig.js';

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

    if (files.profileImage) {
      // Delete old from Cloudinary
      const oldId = getPublicIdFromUrl(settings.profileImage);
      if (oldId) await deleteFromCloudinary(oldId);
      const result = await uploadToCloudinary(files.profileImage[0].buffer, 'portfolio/settings');
      settings.profileImage = result.secure_url;
    }

    if (files.heroImage) {
      const oldId = getPublicIdFromUrl(settings.heroImage);
      if (oldId) await deleteFromCloudinary(oldId);
      const result = await uploadToCloudinary(files.heroImage[0].buffer, 'portfolio/settings');
      settings.heroImage = result.secure_url;
    }

    if (files.logo) {
      const oldId = getPublicIdFromUrl(settings.logo);
      if (oldId) await deleteFromCloudinary(oldId);
      const result = await uploadToCloudinary(files.logo[0].buffer, 'portfolio/settings');
      settings.logo = result.secure_url;
    }

    if (files.favicon) {
      const oldId = getPublicIdFromUrl(settings.favicon);
      if (oldId) await deleteFromCloudinary(oldId);
      const result = await uploadToCloudinary(files.favicon[0].buffer, 'portfolio/settings');
      settings.favicon = result.secure_url;
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

    // Delete old resume from Cloudinary
    const oldId = getPublicIdFromUrl(settings.resumePdf);
    if (oldId) await deleteFromCloudinary(oldId, 'raw');

    // Upload new resume as raw resource type
    const result = await uploadToCloudinary(files.resumePdf[0].buffer, 'portfolio/resume', 'raw');
    settings.resumePdf = result.secure_url;
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

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(settings.resumePdf);
    if (publicId) await deleteFromCloudinary(publicId, 'raw');

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
