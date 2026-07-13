import express from 'express';
import { Offer } from '../models/Offer.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all active offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ 
      isActive: true,
      validUntil: { $gt: new Date() }
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create offer (admin only)
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('discountCode').notEmpty().withMessage('Discount code is required'),
  body('discountPercent').isNumeric().withMessage('Discount percent must be numeric'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('validUntil').isISO8601().withMessage('Valid until date is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const offer = new Offer(req.body);
    const savedOffer = await offer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update offer (admin only)
router.put('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete offer (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
