import express from 'express';
import database from '../database.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await database.findOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await database.findOrders();
    const userOrders = orders.filter(o => o.userId === req.params.userId);
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const order = await database.createOrder(req.body);
    console.log('✓ Order created for user:', order.userId);
    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Order creation error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Bypass endpoint for guest users
router.get('/bypass', async (req, res) => {
  try {
    const orders = await database.findOrders();
    res.json(orders);
  } catch (error) {
    console.error('❌ Bypass orders error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
