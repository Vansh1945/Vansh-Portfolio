import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema({
  // Basic Information
  websiteName: {
    type: String,
    required: [true, 'Website name is required'],
    trim: true,
    default: 'Vansh Portfolio'
  },
  tagline: {
    type: String,
    trim: true
  },
  developerName: {
    type: String,
    required: [true, 'Developer name is required'],
    trim: true,
    default: 'Vansh'
  },
  designation: {
    type: String,
    trim: true,
    default: 'Full Stack Developer'
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },

  // Profile Images (Local upload paths)
  profileImage: {
    type: String,
    trim: true
  },
  heroImage: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  favicon: {
    type: String,
    trim: true
  },

  // Resume PDF
  resumePdf: {
    type: String,
    trim: true
  },

  // Social Links
  github: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  instagram: { type: String, trim: true },
  twitter: { type: String, trim: true },
  facebook: { type: String, trim: true },
  youtube: { type: String, trim: true },
  whatsapp: { type: String, trim: true },

  // SEO Settings
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  metaKeywords: { type: String, trim: true },
  canonicalUrl: { type: String, trim: true },
  ogImage: { type: String, trim: true },
  robotsIndex: { type: String, trim: true, default: 'index, follow' },
  googleAnalyticsId: { type: String, trim: true },
  googleSearchConsoleVerification: { type: String, trim: true }
}, {
  timestamps: true
});

const WebsiteSettings = mongoose.model('WebsiteSettings', websiteSettingsSchema);

export default WebsiteSettings;
