async function testDirectAPI() {
  try {
    console.log('=== TESTING DIRECT API CALLS ===');
    
    // Test 1: Regular orders endpoint
    console.log('\n1. Testing /api/orders');
    try {
      const response1 = await fetch('http://localhost:5000/api/orders');
      console.log('Status:', response1.status);
      const data1 = await response1.json();
      console.log('Type:', typeof data1);
      console.log('Is Array:', Array.isArray(data1));
      console.log('Length:', data1?.length);
      console.log('Data:', data1);
    } catch (error) {
      console.log('Error:', error.message);
    }
    
    // Test 2: Bypass orders endpoint
    console.log('\n2. Testing /api/orders/bypass');
    try {
      const response2 = await fetch('http://localhost:5000/api/orders/bypass');
      console.log('Status:', response2.status);
      const data2 = await response2.json();
      console.log('Type:', typeof data2);
      console.log('Is Array:', Array.isArray(data2));
      console.log('Length:', data2?.length);
      console.log('Data:', data2);
    } catch (error) {
      console.log('Error:', error.message);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testDirectAPI();
