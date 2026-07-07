import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  icon: {
    type: String,
    required: [true, 'Icon identifier is required'],
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
  },
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
  },
  technologyStack: [{
    type: String,
  }],
  featuresIncluded: [{
    type: String,
  }],
  revisions: {
    type: String,
    default: '3',
  },
  supportDuration: {
    type: String,
    default: '30 Days',
  },
  popular: {
    type: Boolean,
    default: false,
  },
  recommended: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  projectsCompleted: {
    type: Number,
    default: 0,
  },
  // Detailed popup content
  details: {
    fullDescription: { type: String },
    whoIsFor: [{ type: String }],
    developmentProcess: [{
      step: { type: String },
      description: { type: String },
      duration: { type: String }
    }],
    timeline: { type: String },
    deliverables: [{ type: String }],
    faqs: [{
      question: { type: String },
      answer: { type: String }
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
