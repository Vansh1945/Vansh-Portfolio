import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  clientImage: {
    type: String,
    trim: true,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Rating (1-5) is required'],
    default: 5,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
