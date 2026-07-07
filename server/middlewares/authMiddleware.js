import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Protect routes - JWT verification attaching data to req.admin
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      // Find Admin and bind to req.admin
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
      }

      next();
    } catch (error) {
      console.error('JWT Token Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Admin middleware (backward compatibility role check)
export const admin = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
};
