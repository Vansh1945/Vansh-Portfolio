import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  pin: {
    type: String,
    required: [true, '4-Digit PIN is required'],
    minlength: [4, 'PIN must be 4 digits'],
    maxlength: [4, 'PIN must be 4 digits'],
    select: false,
  }
}, {
  timestamps: true,
});

// Hash password and PIN before saving
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified('pin')) {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
  }
  next();
});

// Compare password method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare PIN method
adminSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
