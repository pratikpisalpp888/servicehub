const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'provider', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create index on email for faster lookups
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);