const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Create a new address
router.post("/", addressController.createAddress);

// Get all addresses for a user by UID
router.get("/:uid", addressController.getAddresses);

// Update an address by ID
router.put("/:id", addressController.updateAddress);

// Delete an address by ID
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
