import { body, validationResult } from 'express-validator';

// Request validation checker result helper
export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// Project creation validation rules
export const projectValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
    
  body('shortDescription')
    .notEmpty()
    .withMessage('Short description is required')
    .trim(),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),

  body('category')
    .notEmpty()
    .withMessage('Category (Project Type) is required')
    .trim(),

  body('projectOwnership')
    .optional()
    .isIn(['Personal', 'Client', 'Company', 'College', 'Other'])
    .withMessage('Invalid project ownership value'),

  body('status')
    .optional()
    .isIn(['published', 'draft'])
    .withMessage('Status must be published or draft'),

  body('technologies')
    .custom((value) => {
      let tech = value;
      if (typeof value === 'string') {
        try {
          tech = JSON.parse(value);
        } catch (e) {
          tech = value.split(',').map(t => t.trim());
        }
      }
      if (!Array.isArray(tech) || tech.length === 0 || tech.every(t => !t)) {
        throw new Error('At least one technology is required');
      }
      return true;
    }),

  body('features')
    .custom((value) => {
      let feats = value;
      if (typeof value === 'string') {
        try {
          feats = JSON.parse(value);
        } catch (e) {
          feats = value.split(',').map(f => f.trim());
        }
      }
      if (!Array.isArray(feats) || feats.length === 0 || feats.every(f => !f)) {
        throw new Error('At least one project feature is required');
      }
      return true;
    })
];

// Experience creation/update validation rules
export const experienceValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),

  body('organization')
    .notEmpty()
    .withMessage('Organization is required')
    .trim(),

  body('employmentType')
    .optional()
    .isIn(['Full Time', 'Freelance', 'Internship', 'Personal Project', 'Personal', 'Client', 'Company'])
    .withMessage('Invalid employment type'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  body('endDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid date'),

  body('currentlyWorking')
    .optional()
    .isBoolean()
    .withMessage('currentlyWorking must be a boolean')
    .customSanitizer(value => value === 'true' || value === true),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean')
    .customSanitizer(value => value === 'true' || value === true),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),

  body('displayOrder')
    .optional()
    .isInt()
    .withMessage('displayOrder must be an integer')
    .toInt()
];
