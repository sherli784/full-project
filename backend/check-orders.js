const checkOrders = async () => {
  try {
    console.log('Checking current orders...');
    const response = await fetch('http://localhost:5000/api/orders');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const text = await response.text();
    console.log('Response text:', text);
    
    try {
      const orders = JSON.parse(text);
      console.log('Total orders:', orders.length);
      orders.forEach(order => {
        console.log(`Order ID: ${order._id}, Status: ${order.status}, User: ${order.userId}`);
      });
      
      const pendingOrders = orders.filter(o => o.status === 'Pending');
      console.log('Pending orders:', pendingOrders.length);
    } catch (parseError) {
      console.error('Parse error:', parseError);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkOrders();
