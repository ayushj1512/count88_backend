const mongoose = require('mongoose');

// Variant schema
const variantSchema = new mongoose.Schema({
  variant: { type: String, required: true },              // e.g., "2x2 foot"
  mrp: { type: Number, required: true },
  discountedPrice: { type: Number, required: true }
}, { _id: false });

// Image schema
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String }
}, { _id: false });

// Product schema
const productSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
    index: true // For grouping and fast filtering
  },

  name: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  description: String,
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },

  variants: {
    type: [variantSchema],
    validate: [arr => arr.length > 0, 'At least one variant is required.']
  },

  images: {
    type: [imageSchema],
    validate: [arr => arr.length <= 10, 'Cannot upload more than 10 images']
  },

  tags: {
    type: [String],
    default: [] // e.g., ["bestseller", "trending", "new"]
  },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
