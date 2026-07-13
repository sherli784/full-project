async function testOrderPlacement() {
  try {
    console.log('=== TESTING ORDER PLACEMENT ===');
    
    const orderData = {
      userId: 'guest',
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
      address: '123 Test Street, Test City, Test State'
    };
    
    console.log('Sending order data:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('Response status:', response.status);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order placed successfully!');
      console.log('Order result:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Order placement failed');
      console.log('Error:', result);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testOrderPlacement();
