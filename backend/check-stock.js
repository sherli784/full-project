const checkStock = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();
    
    console.log('=== CURRENT STOCK LEVELS ===');
    products.forEach(product => {
      console.log(`\n${product.name}:`);
      Object.entries(product.sizes).forEach(([size, data]) => {
        console.log(`  ${size}: ${data.stock} units (₹${data.price})`);
      });
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkStock();
