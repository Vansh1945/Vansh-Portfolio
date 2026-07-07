import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  employmentType: {
    type: String,
    enum: ['Full Time', 'Freelance', 'Internship'],
    default: 'Full Time',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
  },
  currentlyWorking: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  responsibilities: [{
    type: String,
    trim: true,
  }],
  achievements: [{
    type: String,
    trim: true,
  }],
  technologies: [{
    type: String,
    trim: true,
  }],
  companyLogo: {
    type: String,
    trim: true,
  },
  liveProjectUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
}, {
  timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
