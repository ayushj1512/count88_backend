// routes/collectionRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllCollections,
  createCollection,
  editCollectionName,
  toggleCollectionStatus,
  deleteCollection,
} = require("../controllers/collectionController");

// ✅ GET all collections
router.get("/", getAllCollections);

// ✅ POST create new collection
router.post("/", createCollection);

// ✅ PUT edit collection name
router.put("/:id/edit-name", editCollectionName);

// ✅ PATCH toggle active/inactive
router.patch("/:id/toggle-status", toggleCollectionStatus);

// ✅ DELETE collection
router.delete("/:id", deleteCollection);

module.exports = router;
