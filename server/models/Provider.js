const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  categories: [{
    type: String,
    required: true
  }],
  address: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere',
      required: true
    }
  },
  approved: {
    type: Boolean,
    default: false
  },
  visitCharge: {
    type: Number,
    required: true,
    min: 0
  },
  details: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create geospatial index on location
providerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Provider', providerSchema);