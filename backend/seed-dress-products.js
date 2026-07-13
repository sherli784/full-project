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
      XL: { price: 1599, stock: 2 }
    },
    isNew: true,
    isTrending: true,
  },
  {
    id: 'p3',
    name: 'Classic Pink Linen Shirt',
    category: 'Shirts',
    description: 'Premium linen shirt perfect for summer.',
    image: 'https://i.pinimg.com/originals/ad/ba/4a/adba4aaddfbd54922beb2100cef23ab3.jpg',
    basePrice: 1299,
    sizes: {
      S: { price: 1299, stock: 10 },
      M: { price: 1399, stock: 15 },
      L: { price: 1499, stock: 5 },
      XL: { price: 1599, stock: 2 }
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
      XL: { price: 1599, stock: 2 }
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
      XL: { price: 1599, stock: 2 }
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
      XL: { price: 2000, stock: 8 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p7',
    name: 'Mom Fit Jeans',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://www.alcott.eu/dw/image/v2/BDJZ_PRD/on/demandware.static/-/Sites-catalog-alcott-master/default/dw2596103a/hi-res/5T3591DO_C241_004.jpg?sw=1000&sh=1350&q=90&strip=false',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p8',
    name: 'Baggy Fit Jeans',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://th.bing.com/th/id/OIP.k8BbLDFht0RQAsIMcPP8pwHaJQ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p9',
    name: 'Black Baggy Jeans',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://image.hm.com/assets/hm/11/50/1150f8ad5b5ae8c828862b19044abed043352c51.jpg?imwidth=2160',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p10',
    name: 'Black Mom Fit Jeans',
    category: 'Jeans',
    description: 'Rugged and stylish denim for everyday wear.',
    image: 'https://th.bing.com/th/id/OIP.rLVBQaFCnHFwIIiCIvH3VQAAAA?w=208&h=277&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    basePrice: 1999,
    sizes: {
      S: { price: 1999, stock: 20 },
      M: { price: 2099, stock: 18 },
      L: { price: 2199, stock: 12 },
      XL: { price: 2299, stock: 8 }
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
      XL: { price: 849, stock: 25 }
    },
    isNew: true,
    isTrending: false,
  },
  {
    id: 'p12',
    name: 'Orange Graphic T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://i5.walmartimages.com/asr/4157cd44-1dda-44e4-8973-a49a482425c9_1.79a3c179916e263a8b975595bdf04952.jpeg',
    basePrice: 699,
    sizes: {
      S: { price: 699, stock: 50 },
      M: { price: 749, stock: 45 },
      L: { price: 799, stock: 30 },
      XL: { price: 849, stock: 25 }
    },
    isNew: true,
    isTrending: false,
  },
  {
    id: 'p13',
    name: 'Blue Graphic T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://xyxxcrew.com/cdn/shop/files/iconique-supima-cotton-t-shirt-midnight-blue-front.jpg?v=1713966123',
    basePrice: 699,
    sizes: {
      S: { price: 699, stock: 50 },
      M: { price: 749, stock: 45 },
      L: { price: 799, stock: 30 },
      XL: { price: 849, stock: 25 }
    },
    isNew: true,
    isTrending: false,
  },
  {
    id: 'p14',
    name: 'White Graphic T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://i.pinimg.com/736x/78/fa/25/78fa25edabb59b3dee2d4a709ac0c2e2.jpg',
    basePrice: 699,
    sizes: {
      S: { price: 699, stock: 50 },
      M: { price: 749, stock: 45 },
      L: { price: 799, stock: 30 },
      XL: { price: 849, stock: 25 }
    },
    isNew: true,
    isTrending: false,
  },
  {
    id: 'p15',
    name: 'Black Graphic T-Shirt',
    category: 'T-Shirts',
    description: 'Soft cotton tee with modern graphic print.',
    image: 'https://onemile.in/cdn/shop/files/Black_T-shirt.jpg?v=1727950376&width=400',
    basePrice: 699,
    sizes: {
      S: { price: 699, stock: 50 },
      M: { price: 749, stock: 45 },
      L: { price: 799, stock: 30 },
      XL: { price: 849, stock: 25 }
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
      XL: { price: 5599, stock: 3 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p17',
    name: 'Midnight Grey Party Blazer',
    category: 'Party Wear',
    description: 'Elegant blazer for evening events.',
    image: 'https://blackberrys.com/cdn/shop/files/Luxe_Formal_Grey_Textured_Blazer_Baleno-LJ002432G1-image3_900x900.jpg?v=1733473416',
    basePrice: 4999,
    sizes: {
      S: { price: 4999, stock: 5 },
      M: { price: 5199, stock: 8 },
      L: { price: 5399, stock: 6 },
      XL: { price: 5599, stock: 3 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p18',
    name: 'Midnight Black Party Blazer',
    category: 'Party Wear',
    description: 'Elegant blazer for evening events.',
    image: 'https://boldsir.com/wp-content/uploads/2024/07/6.png',
    basePrice: 4999,
    sizes: {
      S: { price: 4999, stock: 5 },
      M: { price: 5199, stock: 8 },
      L: { price: 5399, stock: 6 },
      XL: { price: 5599, stock: 3 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p19',
    name: 'Elegant Summer Suit',
    category: 'Mens Wear',
    description: 'Stylish summer suit perfect for business meetings.',
    image: 'https://images.unsplash.com/photo-1594639319984-0e6f1b6b5c5a?auto=format&fit=crop&q=80&w=800',
    basePrice: 2999,
    sizes: {
      S: { price: 2999, stock: 8 },
      M: { price: 3199, stock: 12 },
      L: { price: 3399, stock: 10 },
      XL: { price: 3599, stock: 6 }
    },
    isNew: true,
    isTrending: true,
  },
  {
    id: 'p20',
    name: 'Floral Print Summer Shirt',
    category: 'Mens Wear',
    description: 'Stylish floral print shirt for summer occasions.',
    image: 'https://images.unsplash.com/photo-1539008835654-79e4e4a8d2a3?auto=format&fit=crop&q=80&w=800',
    basePrice: 2799,
    sizes: {
      S: { price: 2799, stock: 10 },
      M: { price: 2999, stock: 15 },
      L: { price: 3199, stock: 12 },
      XL: { price: 3399, stock: 8 }
    },
    isNew: true,
    isTrending: false,
  },
  {
    id: 'p21',
    name: 'Classic Black Evening Suit',
    category: 'Mens Wear',
    description: 'Elegant black suit perfect for formal events.',
    image: 'https://images.unsplash.com/photo-1594639319984-0e6f1b6b5c5a?auto=format&fit=crop&q=80&w=800',
    basePrice: 3499,
    sizes: {
      S: { price: 3499, stock: 6 },
      M: { price: 3699, stock: 10 },
      L: { price: 3899, stock: 8 },
      XL: { price: 4099, stock: 4 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p22',
    name: 'Cocktail Party Suit',
    category: 'Mens Wear',
    description: 'Stylish cocktail suit for evening parties.',
    image: 'https://images.unsplash.com/photo-1539008835654-79e4e4a8d2a3?auto=format&fit=crop&q=80&w=800',
    basePrice: 3999,
    sizes: {
      S: { price: 3999, stock: 5 },
      M: { price: 4199, stock: 8 },
      L: { price: 4499, stock: 6 },
      XL: { price: 4799, stock: 3 }
    },
    isNew: false,
    isTrending: false,
  },
  {
    id: 'p23',
    name: 'Traditional Indian Sherwani',
    category: 'Mens Wear',
    description: 'Traditional Indian sherwani with intricate embroidery work.',
    image: 'https://images.unsplash.com/photo-1594639319984-0e6f1b6b5c5a?auto=format&fit=crop&q=80&w=800',
    basePrice: 4999,
    sizes: {
      S: { price: 4999, stock: 8 },
      M: { price: 5499, stock: 12 },
      L: { price: 5999, stock: 10 },
      XL: { price: 6499, stock: 6 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p24',
    name: 'Embroidered Kurta',
    category: 'Mens Wear',
    description: 'Stylish embroidered kurta perfect for festive occasions.',
    image: 'https://images.unsplash.com/photo-1594639319984-0e6f1b6b5c5a?auto=format&fit=crop&q=80&w=800',
    basePrice: 3499,
    sizes: {
      S: { price: 3499, stock: 10 },
      M: { price: 3799, stock: 15 },
      L: { price: 4099, stock: 12 },
      XL: { price: 4299, stock: 8 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p25',
    name: 'Bridal Sherwani',
    category: 'Mens Wear',
    description: 'Elegant bridal sherwani with heavy embroidery and stone work.',
    image: 'https://images.unsplash.com/photo-1594639319984-0e6f1b6b5c5a?auto=format&fit=crop&q=80&w=800',
    basePrice: 8999,
    sizes: {
      S: { price: 8999, stock: 5 },
      M: { price: 9999, stock: 8 },
      L: { price: 10999, stock: 6 },
      XL: { price: 11999, stock: 4 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p26',
    name: 'Anarkali Suit',
    category: 'Mens Wear',
    description: 'Traditional anarkali suit with matching bottoms.',
    image: 'https://images.unsplash.com/photo-1594639319984-0e6f1b6b5c5a?auto=format&fit=crop&q=80&w=800',
    basePrice: 6999,
    sizes: {
      S: { price: 6999, stock: 6 },
      M: { price: 7499, stock: 10 },
      L: { price: 7999, stock: 8 },
      XL: { price: 8499, stock: 4 }
    },
    isNew: false,
    isTrending: true,
  },
  {
    id: 'p27',
    name: 'Bandhani Print Shirt',
    category: 'Mens Wear',
    description: 'Vibrant bandhani print shirt with traditional patterns.',
    image: 'https://images.unsplash.com/photo-1539008835654-79e4e4a8d2a3?auto=format&fit=crop&q=80&w=800',
    basePrice: 4299,
    sizes: {
      S: { price: 4299, stock: 12 },
      M: { price: 4599, stock: 15 },
      L: { price: 4899, stock: 10 },
      XL: { price: 5299, stock: 6 }
    },
    isNew: false,
    isTrending: true,
  }
];

console.log(`Seeding ${products.length} products...`);
await Product.insertMany(products);
console.log('Database seeded successfully!');
console.log('Products added:', products.map(p => `${p.name} (${p.id})`).join(', '));

await mongoose.disconnect();
