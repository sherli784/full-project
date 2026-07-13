import mongoose from 'mongoose';
import { Product } from './models/Product.js';

await mongoose.connect('mongodb://localhost:27017/ecommerce');

console.log('Clearing existing products...');
await Product.deleteMany({});

const products = [
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
      XL: { price: 1599, stock: 2 }
    },
    isNew: true,
    isTrending: true
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
      XL: { price: 1599, stock: 2 }
    },
    isNew: true,
    isTrending: true
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
      XL: { price: 1599, stock: 2 }
    },
    isNew: true,
    isTrending: false
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
      XL: { price: 1599, stock: 2 }
    },
    isNew: true,
    isTrending: false
  },
  {
    id: 'p5',
    name: 'Classic Blue Linen Shirt',
    category: 'Shirts',
    description: 'Premium linen shirt perfect for summer.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.GWi5D8Ukc1MXSKIoao2r9QHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
    basePrice: 1299,
    sizes: {
      S: { price: 1299, stock: 10 },
      M: { price: 1399, stock: 15 },
      L: { price: 1499, stock: 5 },
      XL: { price: 1599, stock: 2 }
    },
    isNew: true,
    isTrending: false
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
      XL: { price: 2000, stock: 8 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p7',
    name: 'Mom Fit Jeans',
    category: 'Jeans',
    description: 'Comfort and style combined for relaxed fit jeans.',
    image: 'https://www.alcott.eu/dw/image/v2/BDJZ_PRD/on/demandware.static/-/Sites-catalog-alcott-master/default/dw2596103a/hi-res/5T3591DO_C241_004.jpg?sw=1000&sh=1350&q=90&strip=false',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p8',
    name: 'Baggy Fit Jeans',
    category: 'Jeans',
    description: 'Loose and comfortable baggy fit for a laid-back look.',
    image: 'https://th.bing.com/th/id/OIP.k8BbLDFht0RQAsIMcPP8pwHaJQ?o=7&rm=3&rs=1&pid=ImgDetMain',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p9',
    name: 'Black Baggy Jeans',
    category: 'Jeans',
    description: 'Black baggy fit jeans for a classic streetwear look.',
    image: 'https://image.hm.com/assets/hm/11/50/1150f8ad5b5ae8c828862b19044abed043352c51.jpg?imwidth=2160',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p10',
    name: 'Black Mom Fit Jeans',
    category: 'Jeans',
    description: 'Classic black mom fit jeans for timeless style.',
    image: 'https://m.media-amazon.com/images/I/61lc3RkKwlL._AC_UY575_.jpg',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
    },
    isNew: false,
    isTrending: false
  },
  {
    id: 'p11',
    name: 'Leather Jacket - Black',
    category: 'Jackets',
    description: 'Premium leather jacket for a bold statement.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=600&fit=crop',
    basePrice: 4999,
    sizes: {
      S: { price: 4999, stock: 8 },
      M: { price: 4999, stock: 12 },
      L: { price: 5999, stock: 10 },
      XL: { price: 5999, stock: 5 }
    },
    isNew: true,
    isTrending: false
  },
  {
    id: 'p12',
    name: 'Denim Jacket - Blue',
    category: 'Jackets',
    description: 'Classic denim jacket for casual wear.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=600&fit=crop',
    basePrice: 2499,
    sizes: {
      S: { price: 2499, stock: 15 },
      M: { price: 2499, stock: 18 },
      L: { price: 2999, stock: 12 },
      XL: { price: 2999, stock: 8 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p13',
    name: 'Wool Cardigan - Cream',
    category: 'Sweaters',
    description: 'Cozy wool cardigan perfect for autumn.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=600&fit=crop',
    basePrice: 2999,
    sizes: {
      S: { price: 2999, stock: 20 },
      M: { price: 2999, stock: 22 },
      L: { price: 3299, stock: 18 },
      XL: { price: 3299, stock: 10 }
    },
    isNew: false,
    isTrending: false
  },
  {
    id: 'p14',
    name: 'Cotton T-Shirt - White',
    category: 'T-Shirts',
    description: 'Basic white cotton t-shirt for everyday wear.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    basePrice: 499,
    sizes: {
      S: { price: 499, stock: 50 },
      M: { price: 499, stock: 60 },
      L: { price: 549, stock: 45 },
      XL: { price: 549, stock: 30 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p15',
    name: 'Cotton T-Shirt - Black',
    category: 'T-Shirts',
    description: 'Classic black cotton t-shirt.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    basePrice: 499,
    sizes: {
      S: { price: 499, stock: 55 },
      M: { price: 499, stock: 65 },
      L: { price: 549, stock: 50 },
      XL: { price: 549, stock: 35 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p16',
    name: 'Party Dress - Red',
    category: 'Party Wear',
    description: 'Stunning red party dress for special occasions.',
    image: 'https://images.unsplash.com/photo-1595777757583-95e059d581b8?w=500&h=600&fit=crop',
    basePrice: 3999,
    sizes: {
      S: { price: 3999, stock: 10 },
      M: { price: 3999, stock: 15 },
      L: { price: 4299, stock: 12 },
      XL: { price: 4299, stock: 8 }
    },
    isNew: true,
    isTrending: true
  },
  {
    id: 'p17',
    name: 'Party Blazer - Navy',
    category: 'Party Wear',
    description: 'Navy party blazer for formal events.',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=600&fit=crop',
    basePrice: 4499,
    sizes: {
      S: { price: 4499, stock: 8 },
      M: { price: 4499, stock: 12 },
      L: { price: 4799, stock: 10 },
      XL: { price: 4799, stock: 6 }
    },
    isNew: true,
    isTrending: false
  },
  {
    id: 'p18',
    name: 'Ethnic Saree - Gold',
    category: 'Ethnic Wear',
    description: 'Beautiful gold ethnic saree with embroidery.',
    image: 'https://images.unsplash.com/photo-1505962468610-d20dab1d44e0?w=500&h=600&fit=crop',
    basePrice: 5999,
    sizes: {
      S: { price: 5999, stock: 5 },
      M: { price: 5999, stock: 8 },
      L: { price: 6299, stock: 7 },
      XL: { price: 6299, stock: 4 }
    },
    isNew: false,
    isTrending: true
  },
  {
    id: 'p19',
    name: 'Ethnic Kurta - Blue',
    category: 'Ethnic Wear',
    description: 'Traditional blue ethnic kurta with handwork.',
    image: 'https://images.unsplash.com/photo-1505962468610-d20dab1d44e0?w=500&h=600&fit=crop',
    basePrice: 2499,
    sizes: {
      S: { price: 2499, stock: 20 },
      M: { price: 2499, stock: 25 },
      L: { price: 2699, stock: 18 },
      XL: { price: 2699, stock: 12 }
    },
    isNew: true,
    isTrending: false
  }
];

await Product.insertMany(products);
console.log(`✅ Successfully seeded ${products.length} products`);

// Display seeded products
const seeded = await Product.find({});
console.log('\n=== SEEDED PRODUCTS ===');
seeded.forEach(p => {
  console.log(`✓ ${p.id}: ${p.name} (${p.category})`);
});

await mongoose.connection.close();
console.log('\n✅ Database seeding complete!');
