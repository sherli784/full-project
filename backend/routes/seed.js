import express from 'express';
import { Product } from '../models/Product.js';
import { Offer } from '../models/Offer.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

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

// Seed data endpoint
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Offer.deleteMany({});

    // Insert products
    const products = await Product.insertMany(sampleProducts);
    
    // Insert offers
    const offers = await Offer.insertMany(sampleOffers);

    res.json({
      message: 'Database seeded successfully!',
      products: products.length,
      offers: offers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
