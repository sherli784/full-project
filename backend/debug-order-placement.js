async function debugOrderPlacement() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== DEBUGGING ORDER PLACEMENT ISSUE ===');
  
  // 1. Check server status
  console.log('\n1. Checking server status...');
  try {
    const response = await fetch(`${BASE_URL}/`);
    console.log('Server status:', response.status);
    if (response.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server not responding properly');
      return;
    }
  } catch (error) {
    console.log('❌ Server connection error:', error.message);
    return;
  }
  
  // 2. Check available products
  console.log('\n2. Checking available products...');
  try {
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const products = await productsResponse.json();
    console.log('Products found:', products.length);
    
    if (products.length > 0) {
      console.log('Sample products:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ID: ${product._id || product.id}, Name: ${product.name}, Price: ${product.price}`);
        if (product.sizes) {
          Object.entries(product.sizes).forEach(([size, data]) => {
            console.log(`     Size ${size}: Price: ${data.price}, Stock: ${data.stock}`);
          });
        }
      });
    } else {
      console.log('❌ No products found');
      return;
    }
  } catch (error) {
    console.log('❌ Error fetching products:', error.message);
  }
  
  // 3. Test order placement with sample data
  console.log('\n3. Testing order placement...');
  try {
    const orderData = {
      userId: 'guest',
      items: [
        {
          productId: 'p1', // Use a known product ID
          productName: 'Classic White Linen Shirt',
          size: 'M',
          quantity: 1,
          priceAtPurchase: 1399
        }
      ],
      totalAmount: 1399,
      paymentMethod: 'COD',
      address: 'Test Address for Order Placement'
    };
    
    console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('Order response status:', orderResponse.status);
    
    const orderResult = await orderResponse.json();
    console.log('Order response:', JSON.stringify(orderResult, null, 2));
    
    if (orderResponse.ok) {
      console.log('✅ Order placed successfully!');
      console.log('Order ID:', orderResult._id || orderResult.id);
    } else {
      console.log('❌ Order placement failed');
      console.log('Error message:', orderResult.message);
      console.log('Error details:', orderResult.errors);
    }
  } catch (error) {
    console.log('❌ Order placement error:', error.message);
  }
  
  // 4. Check bypass endpoint as fallback
  console.log('\n4. Testing bypass order endpoint...');
  try {
    const bypassOrderData = {
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
      address: 'Test Address for Bypass Order'
    };
    
    const bypassResponse = await fetch(`${BASE_URL}/api/orders/bypass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bypassOrderData)
    });
    
    console.log('Bypass response status:', bypassResponse.status);
    
    const bypassResult = await bypassResponse.json();
    console.log('Bypass response:', JSON.stringify(bypassResult, null, 2));
    
    if (bypassResponse.ok) {
      console.log('✅ Bypass order successful!');
    } else {
      console.log('❌ Bypass order failed');
      console.log('Bypass error:', bypassResult.message);
    }
  } catch (error) {
    console.log('❌ Bypass order error:', error.message);
  }
  
  console.log('\n=== ORDER PLACEMENT DEBUGGING COMPLETE ===');
}

debugOrderPlacement();
