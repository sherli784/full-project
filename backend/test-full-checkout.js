const testFullCheckout = async () => {
  try {
    console.log('=== TESTING FULL CHECKOUT FLOW ===');
    
    // Step 1: Test if we can access products
    console.log('\n1. Testing products API...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const products = await productsResponse.json();
    console.log('Products available:', products.length);
    
    // Step 2: Test if bypass endpoint works
    console.log('\n2. Testing bypass endpoint...');
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
    
    const orderResponse = await fetch('http://localhost:5000/api/orders/bypass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    console.log('Order response status:', orderResponse.status);
    console.log('Order response ok:', orderResponse.ok);
    
    if (orderResponse.ok) {
      const result = await orderResponse.json();
      console.log('✅ Order placed successfully:', result);
    } else {
      const errorText = await orderResponse.text();
      console.log('❌ Order failed:', errorText);
    }
    
    // Step 3: Check if we can get orders
    console.log('\n3. Testing orders API...');
    try {
      const ordersResponse = await fetch('http://localhost:5000/api/orders/bypass');
      console.log('Orders response status:', ordersResponse.status);
      
      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        console.log('Orders retrieved:', orders.length);
        console.log('First order:', orders[0]?._id);
      } else {
        const errorText = await ordersResponse.text();
        console.log('Orders error:', errorText);
      }
    } catch (e) {
      console.log('Orders API error:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testFullCheckout();
