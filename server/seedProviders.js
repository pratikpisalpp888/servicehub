const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Provider = require('./models/Provider');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for seeding providers'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Load the service provider dataset
const serviceProviders = require('../standardized_phone_flattened_dataset (1).json');

const seedProviders = async () => {
  try {
    // Clear existing providers
    await Provider.deleteMany({});
    
    console.log('Cleared existing providers');
    
    // Create a default user for all providers (since the dataset doesn't include user info)
    const defaultUser = await User.findOne({ email: 'provider@example.com' });
    let userId;
    
    if (defaultUser) {
      userId = defaultUser._id;
    } else {
      // Create a default provider user if it doesn't exist
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash('provider123', saltRounds);
      
      const user = new User({
        name: 'Service Provider',
        email: 'provider@example.com',
        passwordHash: passwordHash,
        role: 'provider',
        phone: '+91-0000000000'
      });
      
      await user.save();
      userId = user._id;
      console.log('Created default provider user');
    }
    
    // Create providers from the dataset
    for (let i = 0; i < serviceProviders.length; i++) {
      const providerData = serviceProviders[i];
      
      const provider = new Provider({
        userId: userId, // Associate with default user
        businessName: providerData.name,
        categories: [providerData.category],
        address: providerData.address,
        location: {
          type: 'Point',
          coordinates: [providerData.lng, providerData.lat] // GeoJSON format: [longitude, latitude]
        },
        approved: true, // Pre-approve all providers
        visitCharge: Math.floor(Math.random() * 100) + 50, // Random visit charge between 50-150
        details: providerData.description
      });
      
      await provider.save();
    }
    
    console.log(`Created ${serviceProviders.length} service providers from the dataset`);
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProviders();