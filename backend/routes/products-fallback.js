import express from 'express';
import database from '../database.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await database.findProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const products = await database.findProducts();
    const product = products.find(p => p._id === req.params.id || p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin/pm only)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('basePrice').isNumeric().withMessage('Base price must be numeric'),
  body('sizes').isObject().withMessage('Sizes must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await database.createProduct(req.body);
    console.log('✓ Product created:', product.name);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Product creation error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update product (admin/pm only)
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('description').optional().notEmpty().withMessage('Description is required'),
  body('basePrice').optional().isNumeric().withMessage('Base price must be numeric'),
  body('sizes').optional().isObject().withMessage('Sizes must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await database.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('✓ Product updated:', product.name);
    res.json(product);
  } catch (error) {
    console.error('❌ Product update error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete product (admin/pm only)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await database.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('✓ Product deleted:', req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Product deletion error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
