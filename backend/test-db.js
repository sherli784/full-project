import mongoose from 'mongoose';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✓ Connected to MongoDB\n');

    console.log('------- PRODUCTS IN DATABASE -------');
    const products = await Product.find({});
    console.log(`Total products: ${products.length}`);
    products.forEach((p, i) => {
      console.log(`${i + 1}. ID: ${p.id}, Name: ${p.name}, Sizes: ${Object.keys(p.sizes).join(',')}`);
      Object.entries(p.sizes).forEach(([size, data]) => {
        console.log(`   ${size}: price=${data.price}, stock=${data.stock}`);
      });
    });

    console.log('\n------- ORDERS IN DATABASE -------');
    const orders = await Order.find({});
    console.log(`Total orders: ${orders.length}`);
    orders.forEach((o, i) => {
      console.log(`${i + 1}. ID: ${o._id}, User: ${o.userId}, Items: ${o.items.length}, Total: ${o.totalAmount}`);
    });

    console.log('\n✓ Database check complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testDatabase();
