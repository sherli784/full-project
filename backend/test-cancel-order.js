const testCancelOrder = async () => {
  try {
    console.log('=== TESTING ORDER CANCELLATION ===');
    
    // First, get all orders to find one to cancel
    console.log('1. Getting orders...');
    const ordersResponse = await fetch('http://localhost:5000/api/orders/bypass');
    const orders = await ordersResponse.json();
    console.log('Orders found:', orders ? orders.length : 0);
    console.log('Orders type:', typeof orders);
    console.log('Orders:', orders);
    
    if (!orders || orders.length === 0) {
      console.log('No orders to cancel. Creating one first...');
      
      // Create an order to cancel
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
        address: 'Test Address for Cancellation'
      };
      
      const createResponse = await fetch('http://localhost:5000/api/orders/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testOrder)
      });
      
      if (createResponse.ok) {
        const createdOrder = await createResponse.json();
        console.log('✅ Order created:', createdOrder._id);
        
        // Now try to cancel it
        console.log('2. Cancelling order...');
        const cancelResponse = await fetch(`http://localhost:5000/api/orders/${createdOrder._id}/cancel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('Cancel response status:', cancelResponse.status);
        console.log('Cancel response ok:', cancelResponse.ok);
        
        if (cancelResponse.ok) {
          const cancelResult = await cancelResponse.json();
          console.log('✅ Order cancelled successfully:', cancelResult);
        } else {
          const errorText = await cancelResponse.text();
          console.log('❌ Cancel failed:', errorText);
        }
      }
    } else {
      // Find a pending order to cancel
      const pendingOrder = orders.find(o => o.status === 'Pending');
      if (pendingOrder) {
        console.log('2. Cancelling pending order:', pendingOrder._id);
        
        const cancelResponse = await fetch(`http://localhost:5000/api/orders/${pendingOrder._id}/cancel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('Cancel response status:', cancelResponse.status);
        console.log('Cancel response ok:', cancelResponse.ok);
        
        if (cancelResponse.ok) {
          const cancelResult = await cancelResponse.json();
          console.log('✅ Order cancelled successfully:', cancelResult);
        } else {
          const errorText = await cancelResponse.text();
          console.log('❌ Cancel failed:', errorText);
        }
      } else {
        console.log('No pending orders to cancel');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testCancelOrder();
