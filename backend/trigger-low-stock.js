import { batchLowStockNotifications } from './services/emailQueue.js';

// Simulate low stock products
const lowStockProducts = [
  {
    id: 'p1',
    name: 'Classic White Linen Shirt',
    category: 'Shirts',
    sizes: {
      'M': { stock: 2, price: 1399 },
      'L': { stock: 1, price: 1499 }
    }
  },
  {
    id: 'p2',
    name: 'Party Wear Blazer', 
    category: 'Party Wear',
    sizes: {
      'L': { stock: 3, price: 2999 }
    }
  }
];

console.log('🧪 Testing low stock notification with order simulation...');
console.log('📦 Products with low stock:', lowStockProducts.length);

// Trigger the notification system
batchLowStockNotifications(lowStockProducts);

console.log('✅ Low stock notification queued!');
console.log('📧 Check backend console for email details');
