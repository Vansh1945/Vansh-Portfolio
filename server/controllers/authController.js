import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'fallback_secret_key';

// Helper to generate final Admin Access Token
const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '7d',
  });
};

// Login Step 1: Verify Username & Password, return short-lived temp token for PIN check
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password.' });
    }

    const adminUser = await Admin.findOne({ username }).select('+password');

    if (adminUser && (await adminUser.matchPassword(password))) {
      // Create a 5-minute temporary token indicating password success
      const tempToken = jwt.sign({ id: adminUser._id, step: 'pin' }, getJwtSecret(), {
        expiresIn: '10m',
      });

      res.status(200).json({
        success: true,
        requirePin: true,
        message: 'Password verified. Please enter your 4-digit security PIN.',
        tempToken,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Step 2: Verify 4-Digit PIN using tempToken
export const verifyPin = async (req, res) => {
  try {
    const { pin, tempToken } = req.body;

    if (!pin || !tempToken) {
      return res.status(400).json({ message: 'PIN and temporary verification token are required.' });
    }

    // Verify the short-lived temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, getJwtSecret());
      if (decoded.step !== 'pin') {
        return res.status(401).json({ success: false, message: 'Invalid authorization step.' });
      }
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Verification session expired. Please log in again.' });
    }

    const adminUser = await Admin.findById(decoded.id).select('+pin');

    if (adminUser && (await adminUser.matchPin(pin))) {
      res.status(200).json({
        success: true,
        message: 'PIN verified successfully. Welcome to dashboard!',
        data: {
          _id: adminUser._id,
          username: adminUser.username,
          token: generateToken(adminUser._id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid 4-digit security PIN.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register a new admin (with PIN field support)
export const registerUser = async (req, res) => {
  try {
    const { username, password, pin } = req.body;

    if (!pin || pin.length !== 4) {
      return res.status(400).json({ message: 'A 4-digit PIN is required for registration.' });
    }

    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }

    const newAdmin = await Admin.create({
      username,
      password,
      pin
    });

    res.status(201).json({
      success: true,
      data: {
        _id: newAdmin._id,
        username: newAdmin.username,
        token: generateToken(newAdmin._id),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current admin profile
export const getProfile = async (req, res) => {
  try {
    const adminUser = await Admin.findById(req.admin._id);
    if (adminUser) {
      res.status(200).json({
        success: true,
        data: adminUser
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
