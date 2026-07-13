import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
});

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toHexString()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  sizes: {
    S: { price: Number, stock: { type: Number, default: 0 } },
    M: { price: Number, stock: { type: Number, default: 0 } },
    L: { price: Number, stock: { type: Number, default: 0 } },
    XL: { price: Number, stock: { type: Number, default: 0 } }
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'limited-stock'],
    default: 'in-stock'
  },
  ratings: [ratingSchema]
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
