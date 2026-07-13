// Test the order creation API directly
const testOrderData = {
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
  address: '123 Main St, City'
};

console.log('Testing order creation API...\n');
console.log('Sending order data:');
console.log(JSON.stringify(testOrderData, null, 2));
console.log('\n---\n');

fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testOrderData)
})
  .then(res => {
    console.log('Response status:', res.status, res.statusText);
    console.log('Response headers:', {
      'content-type': res.headers.get('content-type')
    });
    return res.text();
  })
  .then(text => {
    console.log('Response body:');
    try {
      console.log(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      console.log(text);
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });
