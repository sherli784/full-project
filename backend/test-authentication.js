async function testAuthentication() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('=== TESTING AUTHENTICATION SYSTEM ===');
  
  // Test 1: Valid User Registration
  console.log('\n1. Testing Valid User Registration');
  try {
    const validUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'Admin@123',
      role: 'user'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validUser)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    
    if (response.ok) {
      console.log('✅ Valid user registration successful');
    } else {
      console.log('❌ Valid user registration failed:', result.errors);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }
  
  // Test 2: Invalid Password Registration
  console.log('\n2. Testing Invalid Password Registration');
  try {
    const invalidUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      password: 'weak', // Invalid password
      role: 'user'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidUser)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    console.log('Errors:', result.errors);
    
    if (!response.ok && result.errors && result.errors[0].includes('Password must contain')) {
      console.log('✅ Password validation working correctly');
    } else {
      console.log('❌ Password validation failed');
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }
  
  // Test 3: Invalid Phone Registration
  console.log('\n3. Testing Invalid Phone Registration');
  try {
    const invalidPhoneUser = {
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '123', // Invalid phone
      password: 'Valid@123',
      role: 'user'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPhoneUser)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    console.log('Errors:', result.errors);
    
    if (!response.ok && result.errors && result.errors[0].includes('Phone number must be exactly 10 digits')) {
      console.log('✅ Phone validation working correctly');
    } else {
      console.log('❌ Phone validation failed');
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }
  
  // Test 4: Duplicate Email Registration
  console.log('\n4. Testing Duplicate Email Registration');
  try {
    const duplicateUser = {
      name: 'John Duplicate',
      email: 'john.doe@example.com', // Already registered
      phone: '5555555555',
      password: 'Valid@123',
      role: 'user'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicateUser)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    console.log('Errors:', result.errors);
    
    if (!response.ok && result.errors && result.errors[0].includes('Email already registered')) {
      console.log('✅ Duplicate email validation working correctly');
    } else {
      console.log('❌ Duplicate email validation failed');
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }
  
  // Test 5: Valid Login
  console.log('\n5. Testing Valid Login');
  try {
    const loginData = {
      email: 'john.doe@example.com',
      password: 'Admin@123'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    console.log('User Role:', result.user?.role);
    
    if (response.ok && result.token) {
      console.log('✅ Valid login successful');
    } else {
      console.log('❌ Valid login failed:', result.errors);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  // Test 6: Invalid Login
  console.log('\n6. Testing Invalid Login');
  try {
    const invalidLogin = {
      email: 'john.doe@example.com',
      password: 'wrongpassword'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidLogin)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    console.log('Errors:', result.errors);
    
    if (!response.ok && result.message === 'Invalid email or password') {
      console.log('✅ Invalid login validation working correctly');
    } else {
      console.log('❌ Invalid login validation failed');
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  // Test 7: Admin Registration
  console.log('\n7. Testing Admin Registration');
  try {
    const adminUser = {
      name: 'Admin User',
      email: 'admin@kmfashion.com',
      phone: '1111111111',
      password: 'Fashion#2024',
      role: 'admin'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminUser)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    console.log('User Role:', result.user?.role);
    
    if (response.ok && result.user?.role === 'admin') {
      console.log('✅ Admin registration successful');
    } else {
      console.log('❌ Admin registration failed:', result.errors);
    }
  } catch (error) {
    console.log('❌ Admin registration error:', error.message);
  }
  
  // Test 8: PM Registration
  console.log('\n8. Testing PM Registration');
  try {
    const pmUser = {
      name: 'PM User',
      email: 'pm@kmfashion.com',
      phone: '2222222222',
      password: 'User@456',
      role: 'pm'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pmUser)
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', result.message);
    console.log('User Role:', result.user?.role);
    
    if (response.ok && result.user?.role === 'pm') {
      console.log('✅ PM registration successful');
    } else {
      console.log('❌ PM registration failed:', result.errors);
    }
  } catch (error) {
    console.log('❌ PM registration error:', error.message);
  }
  
  console.log('\n=== AUTHENTICATION TESTING COMPLETE ===');
}

testAuthentication();
