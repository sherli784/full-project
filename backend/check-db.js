import mongoose from 'mongoose';

async function checkStock() {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    const db = mongoose.connection.db;
    const p1 = await db.collection('products').findOne({ id: 'p1' });
    console.log('p1:', JSON.stringify(p1.sizes));
    process.exit(0);
}

checkStock();
