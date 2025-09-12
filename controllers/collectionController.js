// controllers/collectionController.js
const Collection = require("../models/Collection");

// ✅ GET all collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    return res.status(200).json(collections);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching collections", error: error.message });
  }
};

// ✅ POST create new collection
const createCollection = async (req, res) => {
  const { title, createdBy } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Collection title is required" });
  }

  try {
    const existing = await Collection.findOne({ title });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Collection with this title already exists" });
    }

    const newCollection = new Collection({ title, createdBy });
    const saved = await newCollection.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating collection", error: error.message });
  }
};

// ✅ PUT edit collection name
const editCollectionName = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "New collection title is required" });
  }

  try {
    const existing = await Collection.findOne({ title });
    if (existing && existing._id.toString() !== id) {
      return res
        .status(409)
        .json({ message: "Another collection with same title already exists" });
    }

    const updated = await Collection.findByIdAndUpdate(
      id,
      { title },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Collection not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating collection", error: error.message });
  }
};

// ✅ PATCH toggle active/inactive
const toggleCollectionStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.isActive = !collection.isActive;
    const updated = await collection.save();

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

// ✅ DELETE collection
const deleteCollection = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Collection.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Collection not found" });
    }

    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting collection", error: error.message });
  }
};

module.exports = {
  getAllCollections,
  createCollection,
  editCollectionName,
  toggleCollectionStatus,
  deleteCollection,
};
