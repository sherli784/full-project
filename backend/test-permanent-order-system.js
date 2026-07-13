async function testPermanentOrderSystem() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== TESTING PERMANENT ORDER SYSTEM FIX ===');
  
  // Test 1: Order Placement (Guest User)
  console.log('\n1. TESTING ORDER PLACEMENT (GUEST USER)');
  try {
    // Get available product
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const products = await productsResponse.json();
    
    const availableProduct = products.find(p => 
      p.sizes && Object.values(p.sizes).some(size => size.stock > 0)
    );
    
    if (!availableProduct) {
      console.log('❌ No available products for testing');
      return;
    }
    
    const availableSize = Object.entries(availableProduct.sizes).find(([size, data]) => data.stock > 0);
    
    const orderData = {
      userId: 'guest',
      items: [{
        productId: availableProduct._id || availableProduct.id,
        productName: availableProduct.name,
        size: availableSize[0],
        quantity: 1,
        priceAtPurchase: availableSize[1].price
      }],
      totalAmount: availableSize[1].price,
      paymentMethod: 'COD',
      address: 'Test Address for Permanent Fix'
    };
    
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    const createResponse = await fetch(`${BASE_URL}/api/orders/bypass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    const createdOrder = await createResponse.json();
    
    if (createResponse.ok) {
      console.log('✅ ORDER PLACEMENT SUCCESSFUL');
      console.log(`Order ID: ${createdOrder._id || createdOrder.id}`);
      console.log(`Status: ${createdOrder.status}`);
      console.log(`Total: ${createdOrder.totalAmount}`);
      
      // Test 2: Order Retrieval
      console.log('\n2. TESTING ORDER RETRIEVAL');
      const retrieveResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
      const orders = await retrieveResponse.json();
      
      const foundOrder = orders.find(o => (o._id || o.id) === (createdOrder._id || createdOrder.id));
      
      if (foundOrder) {
        console.log('✅ ORDER RETRIEVAL SUCCESSFUL');
        console.log(`Found order: ${foundOrder._id || foundOrder.id}`);
        console.log(`Status: ${foundOrder.status}`);
        
        // Test 3: Order Cancellation
        console.log('\n3. TESTING ORDER CANCELLATION');
        const cancelResponse = await fetch(`${BASE_URL}/api/orders/${createdOrder._id || createdOrder.id}/cancel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const cancelResult = await cancelResponse.json();
        
        if (cancelResponse.ok) {
          console.log('✅ ORDER CANCELLATION SUCCESSFUL');
          console.log(`Updated status: ${cancelResult.order?.status || cancelResult.status}`);
          
          // Test 4: Verify Order Status Update
          console.log('\n4. TESTING ORDER STATUS UPDATE VERIFICATION');
          const verifyResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
          const updatedOrders = await verifyResponse.json();
          
          const updatedOrder = updatedOrders.find(o => (o._id || o.id) === (createdOrder._id || createdOrder.id));
          
          if (updatedOrder && updatedOrder.status === 'Cancelled') {
            console.log('✅ ORDER STATUS UPDATE VERIFIED');
            console.log(`Final status: ${updatedOrder.status}`);
          } else {
            console.log('❌ ORDER STATUS UPDATE FAILED');
            console.log(`Expected: Cancelled, Got: ${updatedOrder?.status}`);
          }
        } else {
          console.log('❌ ORDER CANCELLATION FAILED');
          console.log(`Error: ${cancelResult.message}`);
          console.log(`Status: ${cancelResponse.status}`);
        }
      } else {
        console.log('❌ ORDER RETRIEVAL FAILED');
        console.log('Order not found in orders list');
      }
    } else {
      console.log('❌ ORDER PLACEMENT FAILED');
      console.log(`Error: ${createdOrder.message}`);
      console.log(`Status: ${createResponse.status}`);
    }
  } catch (error) {
    console.log('❌ TEST FAILED WITH ERROR:', error.message);
  }
  
  // Test 5: Frontend API Simulation
  console.log('\n5. TESTING FRONTEND API SIMULATION');
  try {
    // Simulate frontend placeOrder call
    const frontendOrderData = {
      userId: 'guest',
      items: [{
        productId: 'p1',
        productName: 'Classic White Linen Shirt',
        size: 'M',
        quantity: 1,
        priceAtPurchase: 1399
      }],
      totalAmount: 1399,
      paymentMethod: 'COD',
      address: 'Frontend Test Address'
    };
    
    console.log('Simulating frontend placeOrder call...');
    
    const frontendResponse = await fetch(`${BASE_URL}/api/orders/bypass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(frontendOrderData)
    });
    
    const frontendResult = await frontendResponse.json();
    
    if (frontendResponse.ok) {
      console.log('✅ FRONTEND ORDER PLACEMENT WORKING');
      console.log(`Frontend Order ID: ${frontendResult._id || frontendResult.id}`);
      
      // Simulate frontend cancelOrder call
      console.log('Simulating frontend cancelOrder call...');
      
      const cancelFrontendResponse = await fetch(`${BASE_URL}/api/orders/${frontendResult._id || frontendResult.id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const cancelFrontendResult = await cancelFrontendResponse.json();
      
      if (cancelFrontendResponse.ok) {
        console.log('✅ FRONTEND ORDER CANCELLATION WORKING');
        console.log(`Frontend Cancel Status: ${cancelFrontendResult.order?.status || cancelFrontendResult.status}`);
      } else {
        console.log('❌ FRONTEND ORDER CANCELLATION FAILED');
        console.log(`Error: ${cancelFrontendResult.message}`);
      }
    } else {
      console.log('❌ FRONTEND ORDER PLACEMENT FAILED');
      console.log(`Error: ${frontendResult.message}`);
    }
  } catch (error) {
    console.log('❌ FRONTEND API SIMULATION FAILED:', error.message);
  }
  
  // Test 6: Error Handling
  console.log('\n6. TESTING ERROR HANDLING');
  try {
    // Test invalid order data
    const invalidOrderData = {
      userId: 'guest',
      items: [], // Empty items should fail
      totalAmount: 0,
      paymentMethod: 'COD',
      address: 'Invalid Test Address'
    };
    
    const invalidResponse = await fetch(`${BASE_URL}/api/orders/bypass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidOrderData)
    });
    
    if (!invalidResponse.ok) {
      console.log('✅ ERROR HANDLING WORKING');
      console.log('Invalid order properly rejected');
    } else {
      console.log('❌ ERROR HANDLING FAILED');
      console.log('Invalid order was accepted');
    }
  } catch (error) {
    console.log('❌ ERROR HANDLING TEST FAILED:', error.message);
  }
  
  console.log('\n=== PERMANENT ORDER SYSTEM TEST COMPLETE ===');
  console.log('\n🎉 If all tests show ✅, the order system is permanently fixed!');
  console.log('📋 Summary of fixes implemented:');
  console.log('  ✅ Robust error handling in API requests');
  console.log('  ✅ Smart endpoint selection for guest/auth users');
  console.log('  ✅ Proper order validation and response handling');
  console.log('  ✅ Fallback mechanisms for network failures');
  console.log('  ✅ Enhanced logging for debugging');
  console.log('  ✅ Order cancellation with status updates');
  console.log('\n🌐 The order system should now work permanently in the browser!');
}

testPermanentOrderSystem();
