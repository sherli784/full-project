const testOrder = {
  items: [
    { productId: 'p1', size: 'S', quantity: 1 },
    { productId: 'p2', size: 'M', quantity: 1 }
  ],
  paymentMethod: 'COD',
  address: 'Test Address, Test City, 12345'
};

console.log('Placing order...');
console.log('Order:', JSON.stringify(testOrder, null, 2));

try {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder)
  });

  const data = await response.json();
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  if (response.status === 201) {
    console.log('\n✅ Order placed successfully!');
    console.log('Check backend console for low-stock email trigger.\n');
  } else {
    console.log('\n❌ Order failed');
  }
} catch (error) {
  console.error('Error:', error.message);
}
