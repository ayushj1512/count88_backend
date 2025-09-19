const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // ✅ Firebase UID instead of ObjectId
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ still references Product
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
