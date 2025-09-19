// routes/wishlistRoutes.js

const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishListController");

// ➕ Add product to wishlist
router.post("/add", wishlistController.addToWishlist);

// ❌ Remove product from wishlist
router.post("/remove", wishlistController.removeFromWishlist);

// 📦 Get all wishlist items for a user
router.get("/:userId", wishlistController.getWishlist);

module.exports = router;
