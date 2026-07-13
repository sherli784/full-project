import mongoose from 'mongoose';
import { User } from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✓ Connected to MongoDB\n');

    console.log('Checking existing users...');
    const users = await User.find({});
    console.log(`Total users found: ${users.length}`);
    
    if (users.length === 0) {
      console.log('No users found. Creating test users...');
      
      // Create test users
      const testUsers = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          password: 'password123',
          role: 'user'
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '0987654321',
          password: 'password123',
          role: 'user'
        },
        {
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '5555555555',
          password: 'admin123',
          role: 'admin'
        }
      ];

      for (const userData of testUsers) {
        const user = new User(userData);
        await user.save();
        console.log(`✓ Created user: ${user.name} (${user.email})`);
      }
    } else {
      console.log('Existing users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - ${user.email} - ${user.phone} - ${user.createdAt}`);
      });
    }

    console.log('\n✓ User check complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
