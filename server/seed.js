const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Provider = require('./models/Provider');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Sample data
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
  phone: '+1234567890'
};

const regularUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'user123',
  role: 'user',
  phone: '+1987654321'
};

const providers = [
  {
    businessName: 'Clean Home Services',
    categories: ['Home Cleaning'],
    address: '123 Main St, City A',
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484] // [longitude, latitude]
    },
    visitCharge: 25.00,
    details: 'Professional home cleaning services'
  },
  {
    businessName: 'Quick Repairs',
    categories: ['Electrician', 'Plumber'],
    address: '456 Oak Ave, City B',
    location: {
      type: 'Point',
      coordinates: [-73.9712, 40.7831] // [longitude, latitude]
    },
    visitCharge: 35.00,
    details: 'Expert electricians and plumbers'
  },
  {
    businessName: 'Beauty Salon',
    categories: ['Beauty'],
    address: '789 Pine Rd, City C',
    location: {
      type: 'Point',
      coordinates: [-73.9543, 40.7292] // [longitude, latitude]
    },
    visitCharge: 20.00,
    details: 'Premium beauty and spa services'
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Provider.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create admin user
    const saltRounds = 10;
    const adminPasswordHash = await bcrypt.hash(adminUser.password, saltRounds);
    
    const admin = new User({
      ...adminUser,
      passwordHash: adminPasswordHash
    });
    
    await admin.save();
    console.log('Created admin user');
    
    // Create regular user
    const userPasswordHash = await bcrypt.hash(regularUser.password, saltRounds);
    
    const user = new User({
      ...regularUser,
      passwordHash: userPasswordHash
    });
    
    await user.save();
    console.log('Created regular user');
    
    // Create providers
    for (let i = 0; i < providers.length; i++) {
      const provider = new Provider({
        ...providers[i],
        userId: user._id, // Associate with regular user
        approved: true // Pre-approve for demo
      });
      
      await provider.save();
    }
    
    console.log('Created sample providers');
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();