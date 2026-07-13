async function checkOrders() {
  try {
    console.log('=== CHECKING ORDERS API ===');
    
    const response = await fetch('http://localhost:5000/api/orders');
    const orders = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Total orders:', orders.length);
    
    if (orders.length > 0) {
      console.log('Orders found:');
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id || order.id}`);
        console.log(`   User ID: ${order.userId}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: ${order.totalAmount}`);
        console.log(`   Items: ${order.items?.length || 0}`);
        console.log(`   Created: ${order.createdAt || order.date}`);
        console.log('---');
      });
    } else {
      console.log('No orders found in database');
    }
    
  } catch (error) {
    console.error('Error checking orders:', error.message);
  }
}

checkOrders();
