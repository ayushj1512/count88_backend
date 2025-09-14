const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
} = require("../controllers/userController.js");

const router = express.Router();

// ✅ Register new user
router.post("/register", registerUser);

// ✅ Login user
router.post("/login", loginUser);

// ✅ Forgot password (send reset link/token)
router.post("/forgot-password", forgotPassword);

// ✅ Reset password
router.post("/reset-password", resetPassword);

// ✅ Admin panel routes
router.get("/", getAllUsers);        // Get all users
router.get("/:id", getUserById);    // Get single user by ID

module.exports = router; // ✅ Correct export for CommonJS
