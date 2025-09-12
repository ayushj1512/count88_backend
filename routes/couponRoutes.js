// routes/couponRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/couponController");

// CRUD Routes
router.post("/", createCoupon);
router.get("/", getCoupons);
router.get("/:id", getCouponById);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

// Validate coupon
router.post("/validate", validateCoupon);

module.exports = router; // ✅ Export router correctly
