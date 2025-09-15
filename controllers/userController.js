const User = require("../models/Users"); // ✅ Make sure filename matches

// 🔹 Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log("📥 Register request:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (⚠️ TODO: Hash password before save in production)
    const user = new User({ name, email, password, phone });
    await user.save();

    console.log("✅ User registered:", user.email);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id, // ✅ use Mongo _id
        name: user.name,
        email: user.email,
        phone: user.phone || null,
      },
    });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 🔹 Get all users (excluding password)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Get single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in getUserById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
};
