// Run this once to create an admin account:
// node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aaharshare');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@aaharshare.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('   Email: admin@aaharshare.com');
      console.log('   Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@aaharshare.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
      organization: 'AaharShare',
      address: 'Platform Admin'
    });

    await admin.save();
    console.log('✅ Admin account created successfully!');
    console.log('   Email: admin@aaharshare.com');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
