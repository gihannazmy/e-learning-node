const connectDB = require('../db');
const User = require('../models/user');

const createUser = async () => {
  try {
    await connectDB();
    const email = process.env.TEST_USER_EMAIL || 'admin@example.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', existing.email);
      process.exit(0);
    }
    const user = await User.create({
      name: process.env.TEST_USER_NAME || 'Admin User',
      email,
      password: process.env.TEST_USER_PASSWORD || 'Password123',
      role: 'admin'
    });
    console.log('Created user:', user.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating user:', err.message);
    process.exit(1);
  }
};

createUser();
