const Tag = require('../models/Tags');

// ✅ GET /api/tags → fetch all tags
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    return res.status(200).json(tags);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tags', error: error.message });
  }
};

// ✅ POST /api/tags → create a new tag
const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const existing = await Tag.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'Tag already exists' });
    }

    const tag = await Tag.create({ name: name.trim() });
    return res.status(201).json(tag);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create tag', error: error.message });
  }
};

// ✅ DELETE /api/tags/:id → delete a tag
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Tag.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete tag', error: error.message });
  }
};

module.exports = {
  getTags,
  createTag,
  deleteTag,
};
