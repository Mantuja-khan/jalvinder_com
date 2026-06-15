const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  badge: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: '',
  },
  subcategory: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  highlights: {
    type: [String],
    default: [],
  },
  offers: {
    type: [String],
    default: [],
  },
  warranty: {
    type: String,
    default: '',
  },
  seller: {
    type: String,
    default: 'Jalvindar Computer',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  deliveryDays: {
    type: Number,
    default: 3,
  },
  specs: [{
    label: String,
    value: String,
  }],
  features: [{
    label: String,
    value: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
