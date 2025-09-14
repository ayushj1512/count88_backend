import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

// 🔹 Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log("📥 Register request:", req.body);

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user (userId auto-generated in model pre-save hook)
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    console.log("✅ User registered:", user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: user.userId, // ✅ Always return custom userId
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login request:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Invalid credentials (no user)");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid credentials (wrong password)");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId, // ✅ expose userId
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📥 Forgot password request:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    console.log("✅ Reset token generated for:", email);

    res.status(200).json({
      message: "Password reset token generated",
      resetToken, // ⚠️ only return in dev, not prod
    });
  } catch (error) {
    console.error("❌ Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    console.log("✅ Password reset successful for:", user.email);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -resetToken -resetTokenExpiry");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user =
      (await User.findById(req.params.id).select("-password -resetToken -resetTokenExpiry")) ||
      (await User.findOne({ userId: req.params.id }).select("-password -resetToken -resetTokenExpiry"));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in getUserById:", error);
    res.status(500).json({ message: "Server error" });
  }
};
