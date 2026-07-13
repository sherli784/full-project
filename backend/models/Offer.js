import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discountPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validUntil: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export const Offer = mongoose.model('Offer', offerSchema);
