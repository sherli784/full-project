import fetch from 'node-fetch';

const testOrder = {
  userId: 'test-user-id',
  items: [
    {
      productId: 'p1',
      productName: 'Classic White Linen Shirt',
      size: 'M',
      quantity: 1,
      priceAtPurchase: 1399
    }
  ],
  totalAmount: 1399,
  paymentMethod: 'COD',
  address: 'Test Address'
};

async function testOrderPlacement() {
  try {
    console.log('Testing order placement...');
    console.log('Order data:', JSON.stringify(testOrder, null, 2));
    
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testOrder)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Response body:', result);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOrderPlacement();
