const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase UID
  houseNumber: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);
