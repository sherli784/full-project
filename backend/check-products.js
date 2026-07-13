try {
  const response = await fetch('http://localhost:5000/api/products');
  const products = await response.json();
  console.log(`✅ Backend is running - Found ${products.length} products`);
  if (products.length > 0) {
    console.log('Available Product IDs:');
    products.forEach((p, i) => {
      console.log(`${i+1}. ID: ${p.id}, Name: ${p.name}, Category: ${p.category}`);
    });
  }
  if (products.length > 5) console.log(`  ... and ${products.length - 5} more`);
} catch (error) {
  console.error('❌ Backend not responding:', error.message);
}
