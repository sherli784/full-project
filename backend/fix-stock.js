import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixStock() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('✓ Connected to MongoDB');
    
    const product = await Product.findOne({ id: 'p1' });
    if (product) {
      console.log('Before update:');
      console.log(`  M size stock: ${product.sizes.M.stock}`);
      
      // Update stock to have enough for testing
      product.sizes.M.stock = 100;
      await product.save();
      
      console.log('After update:');
      console.log(`  M size stock: ${product.sizes.M.stock}`);
      console.log('✓ Stock updated successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixStock();
