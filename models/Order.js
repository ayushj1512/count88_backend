const mongoose = require('mongoose');
const Address = require('./Address'); // Import the Address model if needed

// Product item schema inside order (snapshot of product)
const productItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // ref to Product
  name: { type: String, required: true },
  brand: String,
  category: String,
  subcategory: String,
  gender: { type: String, enum: ["Men", "Women", "Unisex", "Kids"] },
  size: String, // Selected size
  price: Number,
  discountPrice: Number,
  quantity: Number,
  image: { url: String, public_id: String } // one main image for display
}, { _id: false });

// Shipping address schema (reuse Address fields)
const shippingSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase UID of the user
  houseNumber: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: String,
}, { _id: false });

// Order schema
const orderSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true }, // Firebase UID
  orderId: { type: String, unique: true, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerMobile: { type: String, required: true },
  orderStatus: {
    type: String,
    enum: ['Pending','Processing','Shipped','Delivered','Cancelled','Returned'],
    default: 'Pending',
  },
  products: { type: [productItemSchema], required: true },
  totalProducts: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  shippingAmount: { type: Number, required: true },
  shippingAddress: { type: shippingSchema, required: true }, // embedded address
  paymentMethod: { type: String, enum: ['COD','UPI','Card','NetBanking'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
