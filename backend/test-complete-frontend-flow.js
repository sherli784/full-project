async function testCompleteFrontendFlow() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== COMPLETE FRONTEND FLOW TEST ===');
  
  // Test 1: Get products (simulating shop page)
  console.log('\n1. Getting products (Shop simulation)...');
  let products = [];
  try {
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    products = await productsResponse.json();
    console.log('✅ Products loaded:', products.length);
    
    // Find a product with stock
    const availableProduct = products.find(p => 
      p.sizes && 
      Object.values(p.sizes).some(size => size.stock > 0)
    );
    
    if (availableProduct) {
      console.log('✅ Found available product:', availableProduct.name);
      console.log('Product ID:', availableProduct._id || availableProduct.id);
      
      // Find available size with stock
      const availableSize = Object.entries(availableProduct.sizes).find(([size, data]) => data.stock > 0);
      if (availableSize) {
        console.log('✅ Available size:', availableSize[0], 'Price:', availableSize[1].price, 'Stock:', availableSize[1].stock);
        
        // Test 2: Simulate adding to cart
        console.log('\n2. Simulating cart item...');
        const cartItem = {
          productId: availableProduct._id || availableProduct.id,
          product: availableProduct,
          size: availableSize[0],
          quantity: 1
        };
        
        console.log('Cart item:', {
          productId: cartItem.productId,
          productName: cartItem.product.name,
          size: cartItem.size,
          quantity: cartItem.quantity,
          price: cartItem.product.sizes[cartItem.size].price
        });
        
        // Test 3: Simulate checkout order data preparation
        console.log('\n3. Simulating checkout order data...');
        const orderData = {
          userId: 'guest', // Simulating guest user
          items: [
            {
              productId: cartItem.productId,
              productName: cartItem.product.name,
              size: cartItem.size,
              quantity: cartItem.quantity,
              priceAtPurchase: cartItem.product.sizes[cartItem.size].price
            }
          ],
          totalAmount: cartItem.product.sizes[cartItem.size].price,
          paymentMethod: 'COD',
          address: 'Test Address for Complete Flow'
        };
        
        console.log('Order data prepared:', JSON.stringify(orderData, null, 2));
        
        // Test 4: Place order using bypass endpoint (guest user)
        console.log('\n4. Placing order (guest user)...');
        const orderResponse = await fetch(`${BASE_URL}/api/orders/bypass`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        const orderResult = await orderResponse.json();
        console.log('Order response status:', orderResponse.status);
        
        if (orderResponse.ok) {
          console.log('✅ Order placed successfully!');
          console.log('Order ID:', orderResult._id || orderResult.id);
          console.log('Order status:', orderResult.status);
          console.log('Total amount:', orderResult.totalAmount);
          
          // Test 5: Verify order appears in orders list
          console.log('\n5. Verifying order in orders list...');
          const ordersResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
          const orders = await ordersResponse.json();
          
          const newOrder = orders.find(o => 
            (o._id || o.id) === (orderResult._id || orderResult.id)
          );
          
          if (newOrder) {
            console.log('✅ Order found in orders list');
            console.log('Order details:', {
              id: newOrder._id || newOrder.id,
              status: newOrder.status,
              totalAmount: newOrder.totalAmount,
              items: newOrder.items.length
            });
          } else {
            console.log('❌ Order not found in orders list');
          }
          
          // Test 6: Test order cancellation
          console.log('\n6. Testing order cancellation...');
          const cancelResponse = await fetch(`${BASE_URL}/api/orders/${orderResult._id || orderResult.id}/cancel`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const cancelResult = await cancelResponse.json();
          console.log('Cancel response status:', cancelResponse.status);
          
          if (cancelResponse.ok) {
            console.log('✅ Order cancelled successfully');
            console.log('Updated status:', cancelResult.order?.status);
          } else {
            console.log('❌ Order cancellation failed:', cancelResult.message);
          }
          
        } else {
          console.log('❌ Order placement failed');
          console.log('Error message:', orderResult.message);
          console.log('Error details:', orderResult.errors);
        }
        
      } else {
        console.log('❌ No available size with stock found');
      }
    } else {
      console.log('❌ No available products found');
    }
    
  } catch (error) {
    console.log('❌ Error in complete flow test:', error.message);
  }
  
  console.log('\n=== COMPLETE FRONTEND FLOW TEST COMPLETE ===');
  console.log('\n🔍 If all tests pass, the frontend order placement should work.');
  console.log('📝 The issue might be in the frontend cart management or UI state.');
  console.log('🌐 Try placing an order in the browser now.');
}

testCompleteFrontendFlow();
