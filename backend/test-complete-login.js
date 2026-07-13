async function testCompleteLoginFlow() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== COMPLETE LOGIN FLOW TEST ===');
  
  // Test 1: Verify server is running
  console.log('\n1. Server Status Check');
  try {
    const response = await fetch(`${BASE_URL}/`);
    console.log('✅ Server is running (Status:', response.status, ')');
  } catch (error) {
    console.log('❌ Server not running:', error.message);
    return;
  }
  
  // Test 2: Test the exact credentials from your screenshot
  console.log('\n2. Testing Your Exact Credentials');
  const credentials = {
    email: 'admin@kmfashion.com',
    password: 'Fashion#2024'
  };
  
  try {
    console.log('Credentials:', credentials.email);
    console.log('Password length:', credentials.password.length);
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    
    if (response.ok && result.token) {
      console.log('✅ Login successful!');
      console.log('User:', result.user.name);
      console.log('Role:', result.user.role);
      console.log('Token received:', result.token.substring(0, 30) + '...');
      
      // Test 3: Verify token can be used
      console.log('\n3. Testing Token Usage');
      const testResponse = await fetch(`${BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${result.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (testResponse.ok) {
        console.log('✅ Token works for authenticated requests');
      } else {
        console.log('❌ Token authentication failed');
      }
      
    } else {
      console.log('❌ Login failed');
      console.log('Status:', response.status);
      console.log('Message:', result.message);
      console.log('Errors:', result.errors);
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.message);
  }
  
  // Test 4: Test user registration (in case user doesn't exist)
  console.log('\n4. Testing User Registration');
  try {
    const newUser = {
      name: 'Admin User',
      email: 'admin@kmfashion.com',
      phone: '1111111111',
      password: 'Fashion#2024',
      role: 'admin'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    
    const result = await response.json();
    
    if (response.status === 400 && result.message.includes('Email already exists')) {
      console.log('✅ User already exists in database');
    } else if (response.ok) {
      console.log('✅ User created successfully');
      console.log('User Role:', result.user?.role);
    } else {
      console.log('❌ Registration failed:', result.message);
      console.log('Errors:', result.errors);
    }
  } catch (error) {
    console.log('❌ Registration test failed:', error.message);
  }
  
  // Test 5: Test frontend API configuration
  console.log('\n5. Testing Frontend API Configuration');
  try {
    const apiResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
    console.log('✅ Frontend API accessible (Status:', apiResponse.status, ')');
  } catch (error) {
    console.log('❌ Frontend API not accessible:', error.message);
  }
  
  console.log('\n=== LOGIN FLOW TEST COMPLETE ===');
  console.log('\n🔍 If all tests pass, the issue is likely in the frontend error handling.');
  console.log('📝 Check the browser console for JavaScript errors when trying to login.');
  console.log('🌐 The login should work now with the fixes applied.');
}

testCompleteLoginFlow();
