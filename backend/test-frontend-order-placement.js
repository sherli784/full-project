async function testFrontendOrderPlacement() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== TESTING FRONTEND ORDER PLACEMENT ===');
  
  // Test 1: Guest user order placement (using bypass endpoint)
  console.log('\n1. Testing guest user order placement...');
  try {
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
      address: 'Test Address for Guest Order'
    };
    
    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    // Test bypass endpoint (for guest users)
    const response = await fetch(`${BASE_URL}/api/orders/bypass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('Response status:', response.status);
    
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Guest order placement successful!');
      console.log('Order ID:', result._id || result.id);
      console.log('Status:', result.status);
    } else {
      console.log('❌ Guest order placement failed');
      console.log('Error:', result.message);
      console.log('Errors:', result.errors);
    }
  } catch (error) {
    console.log('❌ Guest order placement error:', error.message);
  }
  
  // Test 2: Authenticated user order placement
  console.log('\n2. Testing authenticated user order placement...');
  try {
    // First login to get token
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@kmfashion.com',
        password: 'Fashion#2024'
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResponse.ok && loginResult.token) {
      console.log('✅ Login successful, token obtained');
      
      const orderData = {
        userId: loginResult.user.id,
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
        address: 'Test Address for Authenticated User'
      };
      
      // Test main orders endpoint (for authenticated users)
      const orderResponse = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginResult.token}`
        },
        body: JSON.stringify(orderData)
      });
      
      console.log('Order response status:', orderResponse.status);
      
      const orderResult = await orderResponse.json();
      console.log('Order response:', JSON.stringify(orderResult, null, 2));
      
      if (orderResponse.ok) {
        console.log('✅ Authenticated user order placement successful!');
        console.log('Order ID:', orderResult._id || orderResult.id);
        console.log('Status:', orderResult.status);
      } else {
        console.log('❌ Authenticated user order placement failed');
        console.log('Error:', orderResult.message);
        console.log('Errors:', orderResult.errors);
      }
    } else {
      console.log('❌ Login failed, cannot test authenticated order placement');
    }
  } catch (error) {
    console.log('❌ Authenticated order placement error:', error.message);
  }
  
  // Test 3: Check if order appears in orders list
  console.log('\n3. Testing order retrieval...');
  try {
    // Test bypass orders endpoint
    const ordersResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
    const orders = await ordersResponse.json();
    
    console.log('Orders found:', orders.length);
    
    if (orders.length > 0) {
      console.log('Recent orders:');
      orders.slice(0, 3).forEach((order, index) => {
        console.log(`  ${index + 1}. ID: ${order._id || order.id}, Status: ${order.status}, User: ${order.userId}, Total: ${order.totalAmount}`);
      });
      console.log('✅ Order retrieval working');
    } else {
      console.log('❌ No orders found');
    }
  } catch (error) {
    console.log('❌ Order retrieval error:', error.message);
  }
  
  console.log('\n=== FRONTEND ORDER PLACEMENT TEST COMPLETE ===');
}

testFrontendOrderPlacement();
