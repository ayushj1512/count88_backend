const Address = require("../models/Address"); // We'll create Address model next

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const { uid, houseNumber, streetAddress, city, state, pincode, landmark } = req.body;

    if (!uid || !houseNumber || !streetAddress || !city || !state || !pincode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newAddress = await Address.create({
      uid,
      houseNumber,
      streetAddress,
      city,
      state,
      pincode,
      landmark,
    });

    res.status(201).json({ success: true, data: newAddress });
  } catch (err) {
    console.error("Create address error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ message: "UID is required" });

    const addresses = await Address.find({ uid }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update an address by ID
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedAddress = await Address.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAddress) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ success: true, data: updatedAddress });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete an address by ID
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
