async function comprehensiveOrderSystemAudit() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== COMPREHENSIVE ORDER SYSTEM AUDIT ===');
  
  // 1. Check server status
  console.log('\n1. SERVER STATUS CHECK');
  try {
    const response = await fetch(`${BASE_URL}/`);
    console.log('Server Status:', response.status === 200 ? '✅ RUNNING' : '❌ NOT RESPONDING');
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }
  
  // 2. Check all order endpoints
  console.log('\n2. ORDER ENDPOINTS CHECK');
  const endpoints = [
    { method: 'GET', path: '/api/orders', desc: 'Main orders endpoint' },
    { method: 'GET', path: '/api/orders/bypass', desc: 'Bypass orders endpoint' },
    { method: 'POST', path: '/api/orders', desc: 'Create order (auth)' },
    { method: 'POST', path: '/api/orders/bypass', desc: 'Create order (guest)' },
    { method: 'PUT', path: '/api/orders/test/cancel', desc: 'Cancel order endpoint' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const options = endpoint.method === 'POST' || endpoint.method === 'PUT' 
        ? { method: endpoint.method, headers: { 'Content-Type': 'application/json' } }
        : { method: endpoint.method };
      
      const response = await fetch(`${BASE_URL}${endpoint.path}`, options);
      console.log(`${endpoint.desc}: ${response.status} ${response.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.log(`${endpoint.desc}: ❌ ERROR - ${error.message}`);
    }
  }
  
  // 3. Check products and stock
  console.log('\n3. PRODUCTS AND STOCK CHECK');
  try {
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const products = await productsResponse.json();
    
    console.log(`Total products: ${products.length}`);
    
    let availableProducts = 0;
    let totalStock = 0;
    
    products.forEach((product, index) => {
      if (product.sizes) {
        const productStock = Object.values(product.sizes).reduce((sum, size) => sum + size.stock, 0);
        totalStock += productStock;
        
        if (productStock > 0) {
          availableProducts++;
          if (index < 3) {
            console.log(`  ${index + 1}. ${product.name}: ${productStock} items in stock`);
          }
        }
      }
    });
    
    console.log(`Available products: ${availableProducts}/${products.length}`);
    console.log(`Total stock items: ${totalStock}`);
    
    if (availableProducts === 0) {
      console.log('❌ CRITICAL: No products with stock available');
    } else {
      console.log('✅ Products with stock available');
    }
  } catch (error) {
    console.log('❌ Products check failed:', error.message);
  }
  
  // 4. Test complete order flow
  console.log('\n4. COMPLETE ORDER FLOW TEST');
  try {
    // Get available product
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const products = await productsResponse.json();
    
    const availableProduct = products.find(p => 
      p.sizes && Object.values(p.sizes).some(size => size.stock > 0)
    );
    
    if (!availableProduct) {
      console.log('❌ No available products for order test');
      return;
    }
    
    const availableSize = Object.entries(availableProduct.sizes).find(([size, data]) => data.stock > 0);
    
    // Create order data
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
      address: 'Test Address for Audit'
    };
    
    console.log('Creating order...');
    const createResponse = await fetch(`${BASE_URL}/api/orders/bypass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    const createdOrder = await createResponse.json();
    
    if (createResponse.ok) {
      console.log('✅ Order created successfully');
      console.log(`Order ID: ${createdOrder._id || createdOrder.id}`);
      console.log(`Status: ${createdOrder.status}`);
      
      // Test order retrieval
      console.log('Testing order retrieval...');
      const retrieveResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
      const orders = await retrieveResponse.json();
      
      const foundOrder = orders.find(o => (o._id || o.id) === (createdOrder._id || createdOrder.id));
      
      if (foundOrder) {
        console.log('✅ Order retrieved successfully');
        
        // Test order cancellation
        console.log('Testing order cancellation...');
        const cancelResponse = await fetch(`${BASE_URL}/api/orders/${createdOrder._id || createdOrder.id}/cancel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const cancelResult = await cancelResponse.json();
        
        if (cancelResponse.ok) {
          console.log('✅ Order cancelled successfully');
          console.log(`Updated status: ${cancelResult.order?.status || cancelResult.status}`);
        } else {
          console.log('❌ Order cancellation failed');
          console.log(`Error: ${cancelResult.message}`);
        }
      } else {
        console.log('❌ Order not found in retrieval');
      }
    } else {
      console.log('❌ Order creation failed');
      console.log(`Error: ${createdOrder.message}`);
    }
  } catch (error) {
    console.log('❌ Order flow test failed:', error.message);
  }
  
  // 5. Check frontend API configuration
  console.log('\n5. FRONTEND API CONFIGURATION CHECK');
  try {
    // Test the exact API calls the frontend makes
    console.log('Testing frontend API calls...');
    
    // Test getOrders (guest)
    const getOrdersResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
    console.log(`getOrders (guest): ${getOrdersResponse.ok ? '✅' : '❌'}`);
    
    // Test placeOrder (guest)
    const placeOrderData = {
      userId: 'guest',
      items: [{
        productId: 'p1',
        productName: 'Test Product',
        size: 'M',
        quantity: 1,
        priceAtPurchase: 1000
      }],
      totalAmount: 1000,
      paymentMethod: 'COD',
      address: 'Test Address'
    };
    
    const placeOrderResponse = await fetch(`${BASE_URL}/api/orders/bypass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(placeOrderData)
    });
    
    console.log(`placeOrder (guest): ${placeOrderResponse.ok ? '✅' : '❌'}`);
    
    if (placeOrderResponse.ok) {
      const placedOrder = await placeOrderResponse.json();
      
      // Test cancelOrder
      const cancelOrderResponse = await fetch(`${BASE_URL}/api/orders/${placedOrder._id || placedOrder.id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`cancelOrder: ${cancelOrderResponse.ok ? '✅' : '❌'}`);
    }
  } catch (error) {
    console.log('❌ Frontend API test failed:', error.message);
  }
  
  console.log('\n=== AUDIT COMPLETE ===');
  console.log('\n🔍 Check results above for any ❌ marks');
  console.log('📝 All ✅ marks indicate the system is working properly');
  console.log('🌐 If backend tests pass but frontend fails, the issue is in frontend code');
}

comprehensiveOrderSystemAudit();
