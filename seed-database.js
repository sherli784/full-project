import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Import models
import { Product } from './backend/models/Product.js';
import { Offer } from './backend/models/Offer.js';

// Sample data
const sampleProducts = [
  {
    name: 'Classic White Linen Shirt',
    category: 'Shirts',
    description: 'Premium linen shirt perfect for summer.',
    image: 'https://www.aspiga.com/cdn/shop/products/mens-nehru-collar-linen-shirt-white-6.jpg?v=1683894068',
    basePrice: 1299,
    sizes: {
      S: { price: 1299, stock: 10 },
      M: { price: 1399, stock: 15 },
      L: { price: 1499, stock: 5 },
      XL: { price: 1599, stock: 2 },
    },
    isNew: true,
    isTrending: true,
  },
  {
    name: 'Classic Navy Linen Shirt',
    category: 'Shirts',
    description: 'Premium linen shirt perfect for summer.',
    image: 'https://shop.anderson-sheppard.co.uk/cdn/shop/files/2025-navy-1.jpg?v=1719864004',
    basePrice: 1299,
    sizes: {
      S: { price: 1299, stock: 10 },
      M: { price: 1399, stock: 15 },
      L: { price: 1499, stock: 5 },
      XL: { price: 1599, stock: 2 },
    },
    isNew: true,
    isTrending: true,
  },
  {
    name: 'Classic Pink Linen Shirt',
    category: 'Shirts',
    description: 'Premium linen shirt perfect for summer.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.7s-73GMDiatC8Q0D1ENBpQHaLv?rs=1&pid=ImgDetMain&o=7&rm=3',
    basePrice: 1299,
    sizes: {
      S: { price: 1299, stock: 10 },
      M: { price: 1399, stock: 15 },
      L: { price: 1499, stock: 5 },
      XL: { price: 1599, stock: 2 },
    },
    isNew: true,
    isTrending: false,
  },
  {
    name: 'Slim Fit Denim Jeans',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.1piiXRj_QA2ef5gthnz10QHaKG?rs=1&pid=ImgDetMain&o=7&rm=3',
    basePrice: 1999,
    sizes: {
      S: { price: 999, stock: 20 },
      M: { price: 1099, stock: 18 },
      L: { price: 1499, stock: 12 },
      XL: { price: 2000, stock: 8 },
    },
    isNew: false,
    isTrending: true,
  },
  {
    name: 'Urban Graphic T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    basePrice: 699,
    sizes: {
      S: { price: 699, stock: 50 },
      M: { price: 749, stock: 45 },
      L: { price: 799, stock: 30 },
      XL: { price: 849, stock: 25 },
    },
    isNew: true,
    isTrending: false,
  },
  {
    name: 'Midnight Blue Party Blazer',
    category: 'Party Wear',
    description: 'Elegant blazer for evening events.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    basePrice: 4999,
    sizes: {
      S: { price: 4999, stock: 5 },
      M: { price: 5199, stock: 8 },
      L: { price: 5399, stock: 6 },
      XL: { price: 5599, stock: 3 },
    },
    isNew: false,
    isTrending: true,
  }
];

const sampleOffers = [
  {
    title: 'Summer Sale',
    description: 'Flat 20% off on all T-Shirts',
    discountCode: 'SUMMER20',
    discountPercent: 20,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'New User Bonanza',
    description: 'Get ₹500 off on your first order above ₹2000',
    discountCode: 'WELCOME500',
    discountPercent: 10,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Offer.deleteMany({});
    console.log('Cleared existing data');

    // Insert products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products`);

    // Insert offers
    const offers = await Offer.insertMany(sampleOffers);
    console.log(`Inserted ${offers.length} offers`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
