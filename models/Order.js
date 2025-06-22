const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  price: Number,
  quantity: Number,
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  houseNumber: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerMobile: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending',
  },
  products: {
    type: [productItemSchema],
    required: true,
  },
  totalProducts: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: shippingSchema,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI', 'Card', 'NetBanking'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
