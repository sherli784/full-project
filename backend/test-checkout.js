const testCheckout = async () => {
  try {
    console.log('=== TESTING CHECKOUT FLOW ===');
    
    // Test if backend is running
    console.log('1. Testing backend connection...');
    const testResponse = await fetch('http://localhost:5000/api/orders/test');
    console.log('Backend test:', await testResponse.json());
    
    // Test order placement
    console.log('\n2. Testing order placement...');
    const testOrder = {
      userId: 'guest',
      items: [
        { 
          productId: 'p3', 
          productName: 'Classic Pink Linen Shirt', 
          size: 'S', 
          quantity: 1,
          priceAtPurchase: 1299 
        }
      ],
      totalAmount: 1299,
      paymentMethod: 'COD',
      address: 'Test Address, Test City, 12345'
    };
    
    console.log('Order data:', JSON.stringify(testOrder, null, 2));
    
    const orderResponse = await fetch('http://localhost:5000/api/orders/bypass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    console.log('Order response status:', orderResponse.status);
    console.log('Order response ok:', orderResponse.ok);
    
    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.log('Order error:', errorText);
    } else {
      const orderResult = await orderResponse.json();
      console.log('✅ Order placed successfully:', orderResult);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testCheckout();
