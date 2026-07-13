async function debugLogin() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== DEBUGGING LOGIN ISSUE ===');
  
  // 1. Check if server is running
  console.log('\n1. Checking server status...');
  try {
    const healthResponse = await fetch(`${BASE_URL}/`);
    console.log('Server status:', healthResponse.status);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('ℹ️ Server responding but root endpoint not configured');
    }
  } catch (error) {
    console.log('❌ Server connection error:', error.message);
    return;
  }
  
  // 2. Check existing users in database
  console.log('\n2. Checking existing users...');
  try {
    const usersResponse = await fetch(`${BASE_URL}/api/users`);
    const users = await usersResponse.json();
    console.log('Users found:', users.length);
    if (users.length > 0) {
      console.log('Sample users:');
      users.slice(0, 3).forEach((user, index) => {
        console.log(`  ${index + 1}. Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
      });
    }
  } catch (error) {
    console.log('❌ Error fetching users:', error.message);
  }
  
  // 3. Test login with the exact credentials from your screenshot
  console.log('\n3. Testing login with your credentials...');
  const testCredentials = {
    email: 'admin@kmfashion.com',
    password: 'Fashion#2024'
  };
  
  try {
    console.log('Attempting login with:', testCredentials.email);
    
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    });
    
    console.log('Login response status:', loginResponse.status);
    
    const loginResult = await loginResponse.json();
    console.log('Login response:', JSON.stringify(loginResult, null, 2));
    
    if (loginResponse.ok && loginResult.token) {
      console.log('✅ Login successful!');
      console.log('Token received:', loginResult.token.substring(0, 50) + '...');
      console.log('User role:', loginResult.user?.role);
    } else {
      console.log('❌ Login failed');
      console.log('Error message:', loginResult.message);
      console.log('Error details:', loginResult.errors);
    }
  } catch (error) {
    console.log('❌ Login request error:', error.message);
  }
  
  // 4. Test if user exists by trying to register same email
  console.log('\n4. Testing if user exists...');
  try {
    const testUser = {
      name: 'Test Admin',
      email: 'admin@kmfashion.com',
      phone: '1111111111',
      password: 'Fashion#2024',
      role: 'admin'
    };
    
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Register response status:', registerResponse.status);
    console.log('Register message:', registerResult.message);
    
    if (registerResponse.status === 400 && registerResult.message.includes('Email already exists')) {
      console.log('✅ User exists in database');
    } else if (registerResponse.ok) {
      console.log('ℹ️ User was created (didn\'t exist before)');
    }
  } catch (error) {
    console.log('❌ Register test error:', error.message);
  }
  
  // 5. Check frontend API configuration
  console.log('\n5. Checking frontend API...');
  try {
    const apiTestResponse = await fetch(`${BASE_URL}/api/orders/bypass`);
    console.log('API test status:', apiTestResponse.status);
    if (apiTestResponse.ok) {
      console.log('✅ Frontend API is accessible');
    }
  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
  
  console.log('\n=== DEBUGGING COMPLETE ===');
}

debugLogin();
