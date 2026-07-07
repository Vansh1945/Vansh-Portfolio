import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import skillRoutes from './routes/skillRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading local images in frontend
}));
app.use(cors());
app.use(express.json());

// Static uploads serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate Limiting Config (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 10000,
  max: 100000,
  message: {
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running smoothly',
    timestamp: new Date()
  });
});

// Mounted Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/skills', skillRoutes);

// 404 Route Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    console.error('Multer Unexpected Field Error - Field Name:', err.field);
  }
  console.error('Unhandled Server Error:', err.stack || err.message || err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Conditionally listen if not in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
