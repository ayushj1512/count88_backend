// models/Users.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      // ❌ remove required, since we auto-generate
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    image: {
      type: String,
      default: "",
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// 🔹 Auto-generate 6-digit userId if not already set
userSchema.pre("save", async function (next) {
  if (!this.userId) {
    try {
      const lastUser = await mongoose.models.User.findOne({}, {}, { sort: { createdAt: -1 } });

      let nextId = 100001; // starting point
      if (lastUser && lastUser.userId) {
        nextId = parseInt(lastUser.userId, 10) + 1;
      }

      this.userId = String(nextId).padStart(6, "0"); // ensures 6 digits
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// 🔹 Prevent model overwrite issue in Next.js hot-reload
export default mongoose.models.User || mongoose.model("User", userSchema);
