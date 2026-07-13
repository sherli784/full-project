import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { Offer } from './models/Offer.js';

// Load environment variables
dotenv.config();

// Utility function to calculate availability based on stock
const calculateAvailability = (sizes) => {
  const totalStock = Object.values(sizes).reduce((sum, size) => sum + size.stock, 0);
  
  if (totalStock === 0) return 'out-of-stock';
  if (totalStock <= 5) return 'limited-stock';
  return 'in-stock';
};

// Sample data
const sampleProducts = [
  {
    id: 'p1',
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
    id: 'p2',
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
    id: 'p3',
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
    id: 'p4',
    name: 'Classic Purple Linen Shirt',
    category: 'Shirts',
    description: 'Premium linen shirt perfect for summer.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.RyqMVMnmGbqlcjboW66QUgHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3',
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
    id: 'p5',
    name: 'Classic blue Linen Shirt',
    category: 'Shirts',
    description: 'Premium linen shirt perfect for summer.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.GWi5D8Ukc1MXSKIoao2r9QHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
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
    id: 'p6',
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
    id: 'p7',
    name: 'mom fit',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://www.alcott.eu/dw/image/v2/BDJZ_PRD/on/demandware.static/-/Sites-catalog-alcott-master/default/dw2596103a/hi-res/5T3591DO_C241_004.jpg?sw=1000&sh=1350&q=90&strip=false',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 },
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p8',
    name: 'baggy',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://th.bing.com/th/id/OIP.k8BbLDFht0RQAsIMcPP8pwHaJQ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 },
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p9',
    name: ' blackbaggy',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://image.hm.com/assets/hm/11/50/1150f8ad5b5ae8c828862b19044abed043352c51.jpg?imwidth=2160',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 },
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p10',
    name: ' black mom fit',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://th.bing.com/th/id/OIP.rLVBQaFCnHFwIIiCIvH3VQAAAA?w=208&h=277&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 },
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p11',
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
    id: 'p12',
    name: 'orange T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://i5.walmartimages.com/asr/4157cd44-1dda-44e4-8973-a49a482425c9_1.79a3c179916e263a8b975595bdf04952.jpeg',
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
    id: 'p13',
    name: 'blueT-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://xyxxcrew.com/cdn/shop/files/iconique-supima-cotton-t-shirt-midnight-blue-front.jpg?v=1713966123',
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
    id: 'p14',
    name: 'white T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1711475578-61sSSNDSMZL.jpg?crop=0.861xw:0.688xh;0.0785xw,0.204xh&resize=980:*',
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
    id: 'p15',
    name: 'black T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://onemile.in/cdn/shop/files/Black_T-shirt.jpg?v=1727950376&width=400',
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
    id: 'p16',
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
  },
  {
    id: 'p17',
    name: 'Midnight green Party Blazer',
    category: 'Party Wear',
    description: 'Elegant blazer for evening events.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.eu7UV7ujtVsR4bd_EKRQrwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
    basePrice: 4999,
    sizes: {
      S: { price: 4999, stock: 5 },
      M: { price: 5199, stock: 8 },
      L: { price: 5399, stock: 6 },
      XL: { price: 5599, stock: 3 },
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p18',
    name: 'Midnight grey Party Blazer',
    category: 'Party Wear',
    description: 'Elegant blazer for evening events.',
    image: 'https://blackberrys.com/cdn/shop/files/Luxe_Formal_Grey_Textured_Blazer_Baleno-LJ002432G1-image3_900x900.jpg?v=1733473416',
    basePrice: 4999,
    sizes: {
      S: { price: 4999, stock: 5 },
      M: { price: 5199, stock: 8 },
      L: { price: 5399, stock: 6 },
      XL: { price: 5599, stock: 3 },
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p19',
    name: 'Midnight black Party Blazer',
    category: 'Party Wear',
    description: 'Elegant blazer for evening events.',
    image: 'https://boldsir.com/wp-content/uploads/2024/07/6.png',
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

    // Insert products with calculated availability
    const productsWithAvailability = sampleProducts.map(product => ({
      ...product,
      availability: calculateAvailability(product.sizes)
    }));
    
    const products = await Product.insertMany(productsWithAvailability);
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
