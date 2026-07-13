import fetch from 'node-fetch';

async function testUsersAPI() {
  try {
    console.log('Testing /api/users endpoint...');
    
    const response = await fetch('http://localhost:5000/api/users');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Total users:', data.total);
    console.log('Users found:', data.users.length);
    
    if (data.users && data.users.length > 0) {
      console.log('\nSample users:');
      data.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - ${user.email} - ${user.phone} - ${user.createdAt}`);
      });
    } else {
      console.log('No users found in response');
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testUsersAPI();
