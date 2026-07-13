import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import offerRoutes from './routes/offers.js';
import seedRoutes from './routes/seed.js';
import userRoutes from './routes/users.js';

// Import fallback routes
import productFallbackRoutes from './routes/products-fallback.js';
import orderFallbackRoutes from './routes/orders-fallback.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Database connection status
let useFallback = false;

// Connect to MongoDB with fallback
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => {
    console.log('✓ Connected to MongoDB - Using database');
    useFallback = false;
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Using file-based database as fallback');
    useFallback = true;
  });

// API Routes - Use fallback routes if MongoDB is not available
app.use('/api/auth', authRoutes);

if (useFallback) {
  console.log('🔄 Using fallback routes for products and orders');
  app.use('/api/products', productFallbackRoutes);
  app.use('/api/orders', orderFallbackRoutes);
} else {
  console.log('📊 Using MongoDB routes for products and orders');
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
}

app.use('/api/offers', offerRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/users', userRoutes);

// Health check with database status
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: useFallback ? 'file-based' : 'mongodb',
    message: useFallback ? 'Using fallback database' : 'MongoDB connected'
  });
});

// Serve React app at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${useFallback ? 'File-based (fallback)' : 'MongoDB'}`);
  console.log(`🌐 Frontend: http://localhost:5173`);
  console.log(`🔗 Backend: http://localhost:${PORT}`);
});
