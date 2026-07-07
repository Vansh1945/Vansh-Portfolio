import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  projectOwnership: {
    type: String,
    enum: ['Personal', 'Client', 'Company', 'College', 'Other'],
    default: 'Personal',
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true,
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
  },
  gallery: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: [true, 'Category (Project Type) is required'],
    trim: true,
    enum: ['Web App', 'Mobile App', 'Full Stack', 'Frontend', 'Backend API', 'E-Commerce', 'Portfolio', 'Dashboard', 'Game', 'AI/ML', 'Other'],
  },
  technologies: {
    type: [String],
    validate: {
      validator: function (array) {
        return array && array.length > 0;
      },
      message: 'At least one technology is required'
    }
  },
  features: {
    type: [String],
    validate: {
      validator: function (array) {
        return array && array.length > 0;
      },
      message: 'At least one project feature is required'
    }
  },
  liveDemo: {
    type: String,
    trim: true,
  },
  githubRepo: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  displayOrder: {
    type: Number,
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
