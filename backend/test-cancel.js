const testCancel = async () => {
  try {
    console.log('Testing order cancellation...');
    
    // First, create an order to cancel
    const testOrder = {
      items: [
        { productId: 'p1', size: 'S', quantity: 1 }
      ],
      paymentMethod: 'COD',
      address: 'Test Address, Test City, 12345'
    };
    
    console.log('Creating test order...');
    const createResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    if (!createResponse.ok) {
      throw new Error('Failed to create order');
    }
    
    const order = await createResponse.json();
    console.log('Order created:', order._id);
    
    // Now cancel the order
    console.log('Cancelling order...');
    const cancelResponse = await fetch(`http://localhost:5000/api/orders/${order._id}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!cancelResponse.ok) {
      throw new Error('Failed to cancel order');
    }
    
    const cancelResult = await cancelResponse.json();
    console.log('Order cancelled successfully:', cancelResult);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testCancel();
