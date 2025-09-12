import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"], // % discount OR flat ₹ discount
      required: true,
    },

    discountValue: {
      type: Number,
      required: true, // percentage value or flat value
    },

    maxDiscount: {
      type: Number,
      default: null, 
      // for "upto" cases like 20% upto ₹200 
      // keep null if not applicable
    },

    minOrderAmount: {
      type: Number,
      default: 0, // minimum cart value required
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      default: null, // total times coupon can be used (global)
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure expiry and active status check
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.expiryDate &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Calculate discount amount for a given order total
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (!this.isValid()) return 0;

  let discount = 0;

  if (this.discountType === "PERCENTAGE") {
    discount = (orderAmount * this.discountValue) / 100;

    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount; // apply "upto" logic
    }
  } else if (this.discountType === "FLAT") {
    discount = this.discountValue;
  }

  // ensure discount does not exceed order amount
  return Math.min(discount, orderAmount);
};

const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
