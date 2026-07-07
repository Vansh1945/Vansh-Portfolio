import multer from 'multer';
import path from 'path';

// Use memory storage — files are held as buffers for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|svg|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (file.fieldname === 'resumePdf') {
    if (path.extname(file.originalname).toLowerCase() === '.pdf') {
      return cb(null, true);
    }
    return cb(new Error('Only PDF files are allowed for resume'), false);
  }

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: File upload only supports images/svg (jpeg, jpg, png, webp, svg)'), false);
};

export const uploadSettings = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
}).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'resumePdf', maxCount: 1 }
]);
