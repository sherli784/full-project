import mongoose from 'mongoose';
import { Product } from './models/Product.js';

await mongoose.connect('mongodb://localhost:27017/ecommerce');

// Clear and add sample products with known low stock
await Product.deleteMany({});

const products = [
  {
    id: 'p1',
    name: 'Sample Tee',
    category: 'T-Shirts',
    description: 'Classic cotton t-shirt',
    image: 'tee.jpg',
    basePrice: 500,
    sizes: {
      S: { price: 500, stock: 3 },
      M: { price: 500, stock: 5 },
      L: { price: 500, stock: 7 }
    }
  },
  {
    id: 'p2',
    name: 'Party Blazer',
    category: 'Party Wear',
    description: 'Stylish party blazer',
    image: 'blazer.jpg',
    basePrice: 1500,
    sizes: {
      M: { price: 1500, stock: 2 },
      L: { price: 1500, stock: 4 },
      XL: { price: 1500, stock: 8 }
    }
  }
];

await Product.insertMany(products);
console.log('✅ Products seeded');

// Now place an order that will trigger low-stock alert
const testOrder = {
  items: [
    { productId: 'p1', size: 'S', quantity: 3 }, // Will drop to 0
    { productId: 'p2', size: 'M', quantity: 2 }  // Will drop to 0
  ],
  paymentMethod: 'COD',
  address: '123 Test Street'
};

console.log('\n=== PLACING ORDER TO TRIGGER LOW-STOCK ALERT ===\n');

const response = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testOrder)
});

const data = await response.json();
console.log(`Response: ${response.status}`);
console.log(JSON.stringify(data, null, 2));

if (response.status === 201) {
  console.log('\n✅ Order created! Check backend console for low-stock email alert.');
}

await mongoose.connection.close();
