import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';

dotenv.config();

async function setStock(productId, size, value) {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
  console.log('Connected to DB');
  const res = await Product.updateOne({ id: productId }, { $set: { [`sizes.${size}.stock`]: value } });
  console.log('Update result:', res);
  const p = await Product.findOne({ id: productId });
  console.log('Updated product sizes:', p.sizes);
  process.exit(0);
}

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node set-stock.js <productId> <size> <value>');
  process.exit(1);
}

setStock(args[0], args[1], Number(args[2])).catch(err => { console.error(err); process.exit(1); });
