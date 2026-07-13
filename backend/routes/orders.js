import express from 'express';
import { body, validationResult } from 'express-validator';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import jwt from 'jsonwebtoken';
import { checkLowStock, sendLowStockNotification } from '../services/emailService.js';
import { batchLowStockNotifications } from '../services/emailQueue.js';

const router = express.Router();

// In-memory order store for mock data
let mockOrders = [];

// Middleware to check authentication
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    req.user.userId = decoded.userId; // Add userId for compatibility
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Optional authentication middleware (doesn't fail if token is missing)
const optionalAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      req.user.userId = decoded.userId;
    } catch (error) {
      console.log('Token verification failed, allowing unauthenticated access');
    }
  }
  next();
};

// Test endpoint
router.get('/test', (req, res) => {
  console.log('=== TEST ENDPOINT HIT ===');
  res.json({ message: 'Backend is working', timestamp: new Date().toISOString() });
});

// Bypass endpoint for testing
router.post('/bypass', async (req, res) => {
  console.log('=== BYPASS ORDER REQUEST ===');
  console.log('Request body:', req.body);
  
  try {
    const { items, paymentMethod, address, userId = 'guest' } = req.body; // Use userId from request or default to 'guest'
    
    // Use mock products instead of database
    const mockProducts = [
      {
        id: 'p1',
        name: 'Classic White Linen Shirt',
        sizes: {
          S: { price: 1299, stock: 8 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 0 },
          XL: { price: 1599, stock: 2 },
        }
      },
      {
        id: 'p2',
        name: 'Classic Navy Linen Shirt',
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        }
      },
      {
        id: 'p3',
        name: 'Classic Pink Linen Shirt',
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        }
      },
      {
        id: 'p4',
        name: 'Classic Purple Linen Shirt',
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        }
      },
      {
        id: 'p5',
        name: 'Classic blue Linen Shirt',
        sizes: {
          S: { price: 1299, stock: 10 },
          M: { price: 1399, stock: 15 },
          L: { price: 1499, stock: 5 },
          XL: { price: 1599, stock: 2 },
        }
      },
      {
        id: 'p6',
        name: 'Slim Fit Denim Jeans',
        sizes: {
          S: { price: 999, stock: 20 },
          M: { price: 1099, stock: 18 },
          L: { price: 1499, stock: 12 },
          XL: { price: 2000, stock: 8 },
        }
      },
      {
        id: 'p7',
        name: 'Mom Fit Jeans',
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        }
      },
      {
        id: 'p8',
        name: 'Baggy Fit Jeans',
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        }
      },
      {
        id: 'p9',
        name: 'Black Baggy Jeans',
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        }
      },
      {
        id: 'p10',
        name: 'Black Mom Fit Jeans',
        sizes: {
          S: { price: 1999, stock: 20 },
          M: { price: 2099, stock: 18 },
          L: { price: 2199, stock: 12 },
          XL: { price: 2299, stock: 8 },
        }
      },
      {
        id: 'p11',
        name: 'Urban Graphic T-Shirt',
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        }
      },
      {
        id: 'p12',
        name: 'Orange Graphic T-Shirt',
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        }
      },
      {
        id: 'p13',
        name: 'Blue Graphic T-Shirt',
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        }
      },
      {
        id: 'p14',
        name: 'White Graphic T-Shirt',
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        }
      },
      {
        id: 'p15',
        name: 'Black Graphic T-Shirt',
        sizes: {
          S: { price: 699, stock: 50 },
          M: { price: 749, stock: 45 },
          L: { price: 799, stock: 30 },
          XL: { price: 849, stock: 25 },
        }
      },
      {
        id: 'p16',
        name: 'Midnight Blue Party Blazer',
        sizes: {
          S: { price: 4999, stock: 5 },
          M: { price: 5199, stock: 8 },
          L: { price: 5399, stock: 6 },
          XL: { price: 5599, stock: 3 },
        }
      },
      {
        id: 'p17',
        name: 'Midnight Grey Party Blazer',
        sizes: {
          S: { price: 4999, stock: 5 },
          M: { price: 5199, stock: 8 },
          L: { price: 5399, stock: 6 },
          XL: { price: 5599, stock: 3 },
        }
      },
      {
        id: 'p18',
        name: 'Midnight Black Party Blazer',
        sizes: {
          S: { price: 4999, stock: 5 },
          M: { price: 5199, stock: 8 },
          L: { price: 5399, stock: 6 },
          XL: { price: 5599, stock: 3 },
        }
      }
    ];
    
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = mockProducts.find(p => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      const sizeData = product.sizes[item.size];
      if (!sizeData || sizeData.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name} size ${item.size}` });
      }

      const itemTotal = sizeData.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        size: item.size,
        quantity: item.quantity,
        priceAtPurchase: sizeData.price
      });
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const order = {
      _id: orderId,
      id: orderId,
      userId: userId, // Use userId from request
      items: orderItems,
      totalAmount,
      paymentMethod,
      address,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };

    console.log('Order created successfully with ID:', order.id);
    
    // Store order in mock orders array
    mockOrders.push(order);
    console.log('Order stored in mock orders. Total orders:', mockOrders.length);
    
    console.log('=== ORDER REQUEST END ===');
    
    res.status(201).json(order);
  } catch (error) {
    console.log('=== ERROR IN BYPASS ORDER ===');
    console.log('Error details:', error);
    console.log('Error stack:', error.stack);
    console.log('=== ERROR END ===');
    res.status(500).json({ message: `Order creation failed: ${error.message}` });
  }
});

// Get all orders (bypass for guest users)
router.get('/bypass', async (req, res) => {
  console.log('=== GET BYPASS ORDERS REQUEST ===');
  try {
    let allOrders = [];
    
    // First, get database orders
    try {
      const dbOrders = await Order.find({})
        .populate('items.productId')
        .sort({ createdAt: -1 });
      console.log('Database orders found:', dbOrders.length);
      allOrders = allOrders.concat(dbOrders);
    } catch (dbError) {
      console.log('Database orders failed:', dbError.message);
    }
    
    // Then, get mock orders
    console.log('Current mock orders count:', mockOrders.length);
    if (mockOrders.length > 0) {
      allOrders = allOrders.concat(mockOrders);
    }
    
    // Remove duplicates (prefer database orders)
    const uniqueOrders = [];
    const seenIds = new Set();
    
    for (const order of allOrders) {
      const orderId = order._id || order.id;
      if (!seenIds.has(orderId)) {
        seenIds.add(orderId);
        uniqueOrders.push(order);
      }
    }
    
    console.log('Total unique orders:', uniqueOrders.length);
    res.json(uniqueOrders);
  } catch (error) {
    console.error('Get bypass orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get user's orders
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    let orders;
    
    if (req.user && req.user.userId) {
      // Authenticated user: get their orders
      orders = await Order.find({ userId: req.user.userId })
        .populate('items.productId')
        .sort({ createdAt: -1 });
    } else {
      // Guest user: get all guest orders
      orders = await Order.find({ 
        $or: [
          { userId: 'guest' },
          { userId: { $exists: false } },
          { userId: null }
        ]
      })
        .populate('items.productId')
        .sort({ createdAt: -1 });
    }
    
    console.log('Orders retrieved:', orders.length);
    console.log('User:', req.user ? req.user.userId : 'guest');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', optionalAuthMiddleware, [
  body('items').isArray().withMessage('Items must be an array'),
  body('paymentMethod').isIn(['COD', 'UPI']).withMessage('Invalid payment method'),
  body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
  console.log('\n\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║     ORDER CREATION REQUEST RECEIVED    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('------- HEADERS -------');
  console.log(JSON.stringify(req.headers, null, 2));
  console.log('------- AUTH INFO -------');
  console.log('User:', req.user);
  console.log('------- REQUEST BODY -------');
  console.log(JSON.stringify(req.body, null, 2));
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ VALIDATION ERRORS:');
    console.log(JSON.stringify(errors.array(), null, 2));
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, paymentMethod, address } = req.body;
    
    console.log('\n------- PROCESSING ORDER -------');
    console.log('Items count:', items?.length);
    console.log('Payment method:', paymentMethod);
    console.log('Address:', address);
    
    // Calculate total amount and validate stock
    let totalAmount = 0;
    const orderItems = [];

    console.log('\n------- VALIDATING PRODUCTS -------');

    for (const item of items) {
      console.log(`\nLooking for product: ${item.productId}`);
      const product = await Product.findOne({ id: item.productId });
      
      if (!product) {
        console.log(`❌ Product not found: ${item.productId}`);
        console.log('Available products in DB:');
        const allProducts = await Product.find({});
        console.log(allProducts.map(p => ({ id: p.id, name: p.name })));
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      console.log(`✓ Found product: ${product.name}`);
      const sizeData = product.sizes[item.size];
      
      if (!sizeData) {
        console.log(`❌ Size ${item.size} not found for product`);
        console.log('Available sizes:', Object.keys(product.sizes));
        return res.status(400).json({ message: `Size ${item.size} not available for ${product.name}` });
      }
      
      if (sizeData.stock < item.quantity) {
        console.log(`❌ Insufficient stock - Requested: ${item.quantity}, Available: ${sizeData.stock}`);
        return res.status(400).json({ message: `Insufficient stock for ${product.name} size ${item.size}` });
      }

      console.log(`✓ Stock OK - Qty: ${item.quantity}, Price: ${sizeData.price}`);
      const itemTotal = sizeData.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        size: item.size,
        quantity: item.quantity,
        priceAtPurchase: sizeData.price
      });
    }

    console.log('\n------- UPDATING STOCK & SAVING ORDER -------');
    console.log('Order items:', orderItems.length);
    console.log('Total amount:', totalAmount);

    // Decrement stock in DB and collect any low-stock items
    const lowStockAlerts = [];
    const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;

    for (const it of orderItems) {
      // decrement stock atomically
      const decPath = `sizes.${it.size}.stock`;
      await Product.updateOne({ id: it.productId }, { $inc: { [decPath]: -it.quantity } });
      const updatedProduct = await Product.findOne({ id: it.productId });
      const currentStock = updatedProduct?.sizes?.[it.size]?.stock ?? 0;
      if (currentStock < LOW_STOCK_THRESHOLD) {
        lowStockAlerts.push({ productId: it.productId, productName: it.productName, size: it.size, stock: currentStock, category: updatedProduct.category });
      }
    }

    const userId = req.body.userId || req.user?.userId || 'guest';
    console.log('User ID:', userId);

    const order = new Order({
      userId: userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      address
    });

    await order.save();
    console.log('✓ Order saved successfully');
    console.log('Order ID:', order._id);

    // If any low stock items found, send alert email (best-effort)
    try {
      if (lowStockAlerts.length > 0) {
        const recipient = process.env.LOW_STOCK_EMAIL || 'sherlij.23bsr@kongu.edu';
        console.log('Low stock items detected, sending alert to', recipient);
        sendLowStockNotification(lowStockAlerts).catch(err => {
          console.error('Error sending low stock email:', err);
        });
      }
    } catch (err) {
      console.error('Failed to trigger low stock alert:', err);
    }

    // Convert to plain JSON to avoid MongoDB ObjectId serialization issues
    const orderResponse = {
      _id: order._id.toString(),
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      address: order.address,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    res.status(201).json(orderResponse);
  } catch (error) {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║          ❌ ORDER CREATION ERROR       ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('Full error:', error);
    console.log('╔════════════════════════════════════════╝\n\n');
    
    res.status(500).json({ message: `Order creation failed: ${error.message}` });
  }
});

// Update order status (admin only)
router.put('/:id/status', [
  body('status').isIn(['Pending', 'Processing', 'Shipped', 'Delivered']).withMessage('Invalid status')
], authMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel order (user only)
router.put('/:id/cancel', optionalAuthMiddleware, async (req, res) => {
  console.log('\n\n');
  console.log('╔══════════════════════════════════════╗');
  console.log('║        ORDER CANCELLATION REQUEST        ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('Order ID:', req.params.id);
  console.log('User:', req.user);

  try {
    console.log('Looking for order with ID:', req.params.id);
    
    // First try to find order in database
    let order = null;
    try {
      order = await Order.findById(req.params.id);
      console.log('Database order found:', order ? 'Yes' : 'No');
    } catch (dbError) {
      console.log('Database search failed, trying fallback:', dbError.message);
    }
    
    // If not found in database, try mock orders
    if (!order) {
      console.log('Checking mock orders...');
      const orderIndex = mockOrders.findIndex(o => o.id === req.params.id || o._id === req.params.id);
      order = orderIndex !== -1 ? mockOrders[orderIndex] : null;
      console.log('Mock order found:', order ? 'Yes' : 'No');
      
      if (order) {
        // Update mock order
        if (order.status !== 'Pending') {
          return res.status(400).json({ message: 'Only pending orders can be cancelled' });
        }
        
        mockOrders[orderIndex] = { ...order, status: 'Cancelled' };
        console.log('Order cancelled successfully in mock data');
        
        return res.json({
          message: 'Order cancelled successfully',
          order: mockOrders[orderIndex]
        });
      }
    }
    
    if (!order) {
      console.log('Order not found, returning 404');
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user (unless admin)
    if (req.user && order.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    // Update order status in database
    order.status = 'Cancelled';
    await order.save();
    
    console.log('Order cancelled successfully in database');

    res.json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({ message: `Order cancellation failed: ${error.message}` });
  }
});

export default router;
