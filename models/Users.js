const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"], minlength: [6, "Password must be at least 6 characters"] },
  },
  { timestamps: true }
);

// 🔹 Auto-generate 6-digit userId if not already set
userSchema.pre("save", async function (next) {
  if (!this.userId) {
    try {
      const lastUser = await mongoose.models.User.findOne({}, {}, { sort: { createdAt: -1 } });

      let nextId = 100001;
      if (lastUser && lastUser.userId) {
        nextId = parseInt(lastUser.userId, 10) + 1;
      }

      this.userId = String(nextId).padStart(6, "0");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// ✅ Correct export for CommonJS
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
