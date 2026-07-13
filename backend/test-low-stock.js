import mongoose from 'mongoose';
import { Product } from './models/Product.js';

await mongoose.connect('mongodb://localhost:27017/ecommerce');

console.log('Clearing existing products...');
await Product.deleteMany({});

console.log('Creating test products with low stock...');
const testProducts = [
  {
    id: 'test-p1',
    name: 'Test Tee',
    category: 'T-Shirts',
    description: 'Low stock test product',
    image: 'test.jpg',
    basePrice: 500,
    sizes: {
      S: { price: 500, stock: 5 },
      M: { price: 500, stock: 8 },
      L: { price: 500, stock: 3 }
    }
  },
  {
    id: 'test-p2',
    name: 'Test Party Shirt',
    category: 'Party Wear',
    description: 'Low stock test product',
    image: 'test.jpg',
    basePrice: 1000,
    sizes: {
      M: { price: 1000, stock: 6 },
      L: { price: 1000, stock: 12 },
      XL: { price: 1000, stock: 2 }
    }
  }
];

await Product.insertMany(testProducts);
console.log('✅ Test products created\n');

console.log('=== STOCK LEVELS ===');
testProducts.forEach(p => {
  console.log(`${p.id}: ${p.name}`);
  Object.entries(p.sizes).forEach(([size, data]) => {
    console.log(`  Size ${size}: ${data.stock} units @ ₹${data.price}`);
  });
});

console.log('\n=== PLACING TEST ORDER (will trigger low-stock alert) ===\n');

const testOrder = {
  items: [
    { productId: 'test-p1', size: 'S', quantity: 5 }, // Will bring from 5 to 0
    { productId: 'test-p2', size: 'XL', quantity: 2 } // Will bring from 2 to 0
  ],
  paymentMethod: 'COD',
  address: 'Test Address, Test City, 12345'
};

console.log('Order details:', JSON.stringify(testOrder, null, 2));

try {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder)
  });

  const data = await response.json();
  console.log(`\n✅ Order placed successfully (Status: ${response.status})`);
  console.log('Order ID:', data._id);
  console.log('\nCheck backend console for low-stock email alert output!');
} catch (error) {
  console.error('❌ Error:', error.message);
}

await mongoose.connection.close();
