import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Certificate title is required'],
    trim: true,
  },
  issuer: {
    type: String,
    required: [true, 'Issuer name is required'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Issue date/year is required'],
    trim: true,
  },
  credentialId: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Certificate image URL is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    enum: ['Hackathon', 'Internship', 'Course'],
    default: 'Course',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
