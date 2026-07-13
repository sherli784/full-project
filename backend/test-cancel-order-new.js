// Test order creation and cancellation

async function testOrderFlow() {
  console.log('=== TESTING ORDER CREATION AND CANCELLATION ===');
  
  try {
    // Step 1: Create an order
    console.log('\n1. Creating order...');
    const testOrder = {
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
      address: 'Test Address for Cancellation'
    };
    
    const createResponse = await fetch('http://localhost:5000/api/orders/bypass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    if (!createResponse.ok) {
      throw new Error(`Order creation failed: ${createResponse.status}`);
    }
    
    const createdOrder = await createResponse.json();
    console.log('Order created successfully:', createdOrder.id);
    console.log('Order status:', createdOrder.status);
    
    // Step 2: Get all orders to verify
    console.log('\n2. Getting all orders...');
    const ordersResponse = await fetch('http://localhost:5000/api/orders/bypass');
    const allOrders = await ordersResponse.json();
    console.log('Total orders:', allOrders.length);
    
    // Step 3: Cancel the order
    console.log('\n3. Cancelling order...');
    const cancelResponse = await fetch(`http://localhost:5000/api/orders/${createdOrder.id}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!cancelResponse.ok) {
      const errorData = await cancelResponse.json();
      console.error('Cancel failed:', cancelResponse.status, errorData);
      throw new Error(`Order cancellation failed: ${cancelResponse.status}`);
    }
    
    const cancelResult = await cancelResponse.json();
    console.log('Order cancelled successfully:', cancelResult.message);
    console.log('Updated order status:', cancelResult.order.status);
    
    // Step 4: Verify cancellation
    console.log('\n4. Verifying cancellation...');
    const finalOrdersResponse = await fetch('http://localhost:5000/api/orders/bypass');
    const finalOrders = await finalOrdersResponse.json();
    
    const cancelledOrder = finalOrders.find(o => o.id === createdOrder.id);
    if (cancelledOrder) {
      console.log('✅ Order found with status:', cancelledOrder.status);
      if (cancelledOrder.status === 'Cancelled') {
        console.log('✅ Cancellation verified successfully!');
      } else {
        console.log('❌ Order status not updated correctly');
      }
    } else {
      console.log('❌ Order not found after cancellation');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testOrderFlow();
