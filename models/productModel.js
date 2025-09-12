const mongoose = require('mongoose');

// Variant schema (only footwear size)
const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }   // e.g., "UK 8", "US 10"
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
    index: true // For grouping & fast filtering
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
  category: { type: String, required: true },   // e.g., "Footwear"
  subcategory: { type: String },                // e.g., "Sneakers", "Sandals"

  gender: { 
    type: String, 
    enum: ["Men", "Women", "Unisex", "Kids"], 
    required: true 
  },

  material: { type: String },                   // e.g., "Leather", "Mesh"
  style: { type: String },                      // e.g., "Casual", "Formal", "Sports"

  variants: {
    type: [variantSchema],
    validate: [arr => arr.length > 0, 'At least one variant (size) is required.']
  },

  images: {
    type: [imageSchema],
    validate: [arr => arr.length <= 10, 'Cannot upload more than 10 images']
  },

  tags: {
    type: [String],
    default: [] // e.g., ["bestseller", "new", "limited edition"]
  },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
