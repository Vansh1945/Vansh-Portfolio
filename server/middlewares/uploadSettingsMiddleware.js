import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure folders exist
const settingsDir = './uploads/settings';
const resumeDir = './uploads/resume';

if (!fs.existsSync(settingsDir)) {
  fs.mkdirSync(settingsDir, { recursive: true });
}
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resumePdf') {
      cb(null, resumeDir);
    } else {
      cb(null, settingsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

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
