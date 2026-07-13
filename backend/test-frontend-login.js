async function testFrontendLogin() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== TESTING FRONTEND LOGIN FLOW ===');
  
  // Test the exact same way the frontend does
  console.log('\n1. Testing login with frontend API method...');
  
  try {
    // Simulate the API call from frontend
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@kmfashion.com',
        password: 'Fashion#2024'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.token) {
      console.log('✅ Frontend login API call successful');
      console.log('Token length:', result.token.length);
      console.log('User role:', result.user?.role);
    } else {
      console.log('❌ Frontend login API call failed');
      console.log('Error message:', result.message);
      console.log('Error details:', result.errors);
    }
  } catch (error) {
    console.log('❌ Frontend login error:', error.message);
    console.log('Error details:', error);
  }
  
  // Test with wrong credentials to see error handling
  console.log('\n2. Testing error handling with wrong credentials...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@kmfashion.com',
        password: 'wrongpassword'
      })
    });
    
    const result = await response.json();
    console.log('Error response status:', response.status);
    console.log('Error response body:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      console.log('✅ Error handling working correctly');
      console.log('Error message:', result.message);
      console.log('Error details:', result.errors);
    }
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
  }
  
  console.log('\n=== FRONTEND LOGIN TEST COMPLETE ===');
}

testFrontendLogin();
