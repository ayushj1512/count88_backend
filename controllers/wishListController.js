const Wishlist = require("../models/Wishlist");

// ➕ Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID (uid) and Product ID are required" });
    }

    // Check if already exists
    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });

    res.status(201).json({
      message: "✅ Added to wishlist",
      data: wishlistItem,
    });
  } catch (error) {
    console.error("❌ Add to wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ❌ Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID (uid) and Product ID are required" });
    }

    const removed = await Wishlist.findOneAndDelete({ userId, productId });
    if (!removed) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "✅ Removed from wishlist" });
  } catch (error) {
    console.error("❌ Remove from wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📦 Get all wishlist items for a user
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID (uid) is required" });
    }

    const wishlist = await Wishlist.find({ userId }).populate("productId");

    res.status(200).json({
      message: "✅ Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    console.error("❌ Fetch wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
