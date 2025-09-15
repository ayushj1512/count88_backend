const express = require("express");
const {
  registerUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController"); // .js optional in require

const router = express.Router();

// ✅ Register new user
router.post("/register", registerUser);

// ✅ Admin panel routes
router.get("/", getAllUsers);       // Get all users
router.get("/:id", getUserById);    // Get single user by ID

module.exports = router;
