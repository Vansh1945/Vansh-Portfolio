import multer from 'multer';
import path from 'path';

// Use memory storage — files are held as buffers (req.file.buffer)
// and uploaded to Cloudinary in the controller
const storage = multer.memoryStorage();

// File filter (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const mimeType = allowedExtensions.test(file.mimetype);
  const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error('Only images of type jpg, jpeg, png, and webp are allowed.'));
};

// Multer upload configurations
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Helper fields config for project creation: 1 coverImage, and multiple galleryImages
export const uploadProjectImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 30 }
]);

export const uploadSingleImage = upload.single('image');

export const uploadExperienceLogo = upload.single('companyLogo');

export const uploadClientImage = upload.single('clientImage');

export const uploadSkillLogo = upload.single('logo');

export default upload;
