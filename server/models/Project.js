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
  slug: {
    type: String,
    unique: true,
  },
  displayOrder: {
    type: Number,
  }
}, {
  timestamps: true
});

// Pre-save hook to auto-generate unique slug and automatic displayOrder
projectSchema.pre('save', async function (next) {
  // 1. Auto-generate slug
  if (this.isModified('title') || !this.slug) {
    let generatedSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const Project = mongoose.model('Project');
    let slugExists = await Project.findOne({ slug: generatedSlug, _id: { $ne: this._id } });
    let counter = 1;
    let originalSlug = generatedSlug;
    
    while (slugExists) {
      generatedSlug = `${originalSlug}-${counter}`;
      slugExists = await Project.findOne({ slug: generatedSlug, _id: { $ne: this._id } });
      counter++;
    }
    this.slug = generatedSlug;
  }

  // 2. Auto-generate displayOrder if not set or is 0
  if (this.displayOrder === undefined || this.displayOrder === null || this.displayOrder === 0) {
    const Project = mongoose.model('Project');
    const maxProject = await Project.findOne().sort({ displayOrder: -1 });
    this.displayOrder = maxProject && maxProject.displayOrder ? maxProject.displayOrder + 1 : 1;
  }

  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
