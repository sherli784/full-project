import { sendLowStockNotification } from './services/emailService.js';

// Create test product data
const testProducts = [
  {
    id: 'p1',
    name: 'Classic White Linen Shirt',
    category: 'Shirts',
    sizes: {
      'M': { stock: 3, price: 1399 },
      'L': { stock: 2, price: 1499 }
    }
  },
  {
    id: 'p2', 
    name: 'Party Wear Blazer',
    category: 'Party Wear',
    sizes: {
      'L': { stock: 1, price: 2999 }
    }
  }
];

async function testEmailNotification() {
  console.log('Testing email notification system...');
  console.log('Test products:', testProducts.length);
  
  try {
    const result = await sendLowStockNotification(testProducts);
    console.log('✅ Email notification sent successfully!');
    console.log('Message ID:', result?.messageId);
  } catch (error) {
    console.log('❌ Email notification failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('EMAIL_USER') || error.message.includes('EMAIL_PASS')) {
      console.log('\n📧 Email Configuration Required:');
      console.log('1. Create a .env file in backend directory');
      console.log('2. Add your Gmail credentials:');
      console.log('   EMAIL_USER=your-email@gmail.com');
      console.log('   EMAIL_PASS=your-app-password');
      console.log('3. Enable 2-factor authentication on Gmail');
      console.log('4. Generate an app password for nodemailer');
    }
  }
}

testEmailNotification();
