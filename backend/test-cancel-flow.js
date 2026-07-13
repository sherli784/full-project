const testCancelFlow = async () => {
  try {
    console.log('=== TESTING CANCELLATION FLOW ===');
    
    // Step 1: Create an order via bypass endpoint
    console.log('\n1. Creating order...');
    const testOrder = {
      items: [
        { productId: 'p3', size: 'S', quantity: 1 }
      ],
      paymentMethod: 'COD',
      address: 'Test Address for Cancellation'
    };
    
    const createResponse = await fetch('http://localhost:5000/api/orders/bypass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    console.log('Create response status:', createResponse.status);
    console.log('Create response ok:', createResponse.ok);
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.log('Create error response:', errorText);
      throw new Error('Failed to create order');
    }
    
    const order = await createResponse.json();
    console.log('✅ Order created:', order._id);
    
    // Step 2: Cancel the order
    console.log('\n2. Cancelling order...');
    const cancelResponse = await fetch(`http://localhost:5000/api/orders/${order._id}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!cancelResponse.ok) {
      throw new Error('Failed to cancel order');
    }
    
    const cancelResult = await cancelResponse.json();
    console.log('✅ Order cancelled:', cancelResult.message);
    
    // Step 3: Check stock was restored
    console.log('\n3. Checking product stock...');
    const productResponse = await fetch('http://localhost:5000/api/products');
    const products = await productResponse.json();
    const product = products.find(p => p.id === 'p3');
    
    if (product) {
      console.log(`Product: ${product.name}`);
      console.log(`Size S stock: ${product.sizes.S.stock}`);
    }
    
    console.log('\n=== CANCELLATION FLOW TEST COMPLETE ===');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testCancelFlow();
