import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = './uploads';
const PROJECTS_DIR = './uploads/projects';
const EXPERIENCE_DIR = './uploads/experience';
const TESTIMONIALS_DIR = './uploads/testimonials';
const SKILLS_DIR = './uploads/skills';
const CERTIFICATES_DIR = './uploads/certificates';

// Ensure upload directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}
if (!fs.existsSync(EXPERIENCE_DIR)) {
  fs.mkdirSync(EXPERIENCE_DIR, { recursive: true });
}
if (!fs.existsSync(TESTIMONIALS_DIR)) {
  fs.mkdirSync(TESTIMONIALS_DIR, { recursive: true });
}
if (!fs.existsSync(SKILLS_DIR)) {
  fs.mkdirSync(SKILLS_DIR, { recursive: true });
}
if (!fs.existsSync(CERTIFICATES_DIR)) {
  fs.mkdirSync(CERTIFICATES_DIR, { recursive: true });
}

// Storage configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'coverImage' || file.fieldname === 'galleryImages') {
      cb(null, PROJECTS_DIR);
    } else if (file.fieldname === 'companyLogo') {
      cb(null, EXPERIENCE_DIR);
    } else if (file.fieldname === 'clientImage') {
      cb(null, TESTIMONIALS_DIR);
    } else if (file.fieldname === 'logo') {
      cb(null, SKILLS_DIR);
    } else if (file.fieldname === 'image') {
      cb(null, CERTIFICATES_DIR);
    } else {
      cb(null, UPLOAD_DIR);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
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
