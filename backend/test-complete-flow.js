async function testCompleteFlow() {
  try {
    console.log('=== TESTING COMPLETE ORDER FLOW ===');
    
    // 1. Check current orders
    console.log('\n1. Checking current orders...');
    const currentOrdersResponse = await fetch('http://localhost:5000/api/orders/bypass');
    const currentOrders = await currentOrdersResponse.json();
    console.log('Current orders count:', currentOrders.length);
    
    // 2. Create a new order
    console.log('\n2. Creating new order...');
    const newOrderData = {
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
      address: 'Test Address for Order Display'
    };
    
    const createResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOrderData)
    });
    
    const createdOrder = await createResponse.json();
    console.log('Create order status:', createResponse.status);
    if (createResponse.ok) {
      console.log('✅ Order created successfully!');
      console.log('Order ID:', createdOrder._id || createdOrder.id);
      console.log('User ID:', createdOrder.userId);
      console.log('Status:', createdOrder.status);
    } else {
      console.log('❌ Order creation failed:', createdOrder);
      return;
    }
    
    // 3. Check orders after creation
    console.log('\n3. Checking orders after creation...');
    const afterCreateResponse = await fetch('http://localhost:5000/api/orders/bypass');
    const afterCreateOrders = await afterCreateResponse.json();
    console.log('Orders after creation count:', afterCreateOrders.length);
    
    if (afterCreateOrders.length > currentOrders.length) {
      console.log('✅ New order found in database');
      const newOrder = afterCreateOrders.find(o => 
        (o._id || o.id) === (createdOrder._id || createdOrder.id)
      );
      if (newOrder) {
        console.log('New order details:');
        console.log('  ID:', newOrder._id || newOrder.id);
        console.log('  User ID:', newOrder.userId);
        console.log('  Status:', newOrder.status);
        console.log('  Total:', newOrder.totalAmount);
        console.log('  Created:', newOrder.createdAt || newOrder.date);
      }
    } else {
      console.log('❌ No new order found');
    }
    
    // 4. Test order filtering for guest user
    console.log('\n4. Testing order filtering for guest...');
    const guestOrders = afterCreateOrders.filter(o => 
      o.userId === 'guest' || !o.userId || o.userId === 'test-user-id'
    );
    console.log('Guest orders count:', guestOrders.length);
    
    if (guestOrders.length > 0) {
      console.log('✅ Guest orders found:');
      guestOrders.forEach((order, index) => {
        console.log(`  ${index + 1}. Order ID: ${order._id || order.id}, Status: ${order.status}`);
      });
    } else {
      console.log('❌ No guest orders found');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testCompleteFlow();
